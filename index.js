require("dotenv").config();

const { Client, GatewayIntentBits, ChannelType, PermissionsBitField } = require("discord.js");

const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Bot is running!");
});

app.listen(8000, () => {
    console.log("Web server running on port 8000");
});

const fs = require("fs");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const TOKEN = process.env.TOKEN;

// Role milestones

const TOP_ROLE = "top lyn lover";

const roles = {
    10: "lyn lover`",
    35: "super lyn lover",
    50: "mega lyn lover",
    75: "ultimate lyn lover"
};

// Command list
const commands = {
    "!lynhelp": "Shows this command list",
    "!scan": "Scans all messages and updates lyn counts (Staff only)",
    "!lynlovers": "Shows the Lyn Lovers leaderboard (Staff only)",
    "!changelyn @user amount": "Changes someone's lyn count (Staff only)",
    "!lynstats": "Shows how many lyns you have said",
};

// Load counts
let counts = {};

if (fs.existsSync("counts.json"))
try {
    counts = JSON.parse(fs.readFileSync("counts.json", "utf8"));
} catch (error) {
    console.log("⚠️ counts.json was corrupted, creating a new one.");
    counts = {};
    saveCounts();
}
function saveCounts() {
    fs.writeFileSync("counts.json", JSON.stringify(counts, null, 2));
}

// Give milestone roles
async function giveRoles(member) {

    const total = counts[member.id] || 0;

    for (const milestone of Object.keys(roles).map(Number).sort((a, b) => a - b)) {

        if (total < milestone) continue;

        const role = member.guild.roles.cache.find(
            r => r.name === roles[milestone]
        );

        if (!role) continue;

       if (!member.roles.cache.has(role.id)) {
    await member.roles.add(role);

    console.log(`${member.user.tag} earned ${role.name}`);

    const channel = member.guild.channels.cache.find(
    c => c.name === "general"
);

    if (channel) {
        channel.send(
            `🎉 ${member} has unlocked the **${role.name}** role!`
        ).catch(() => {});
    }
}
    }
}

async function updateTopLynLovers(guild) {

    const topRole = guild.roles.cache.find(r => r.name === TOP_ROLE);

    if (!topRole) return;

    // Sort users by lyn count
    const sortedUsers = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(entry => entry[0]);

    // Remove role from anyone no longer in top 5
    for (const member of topRole.members.values()) {

        if (!sortedUsers.includes(member.id)) {
            await member.roles.remove(topRole).catch(() => {});
        }

    }

    // Give role to current top 5
    for (const userId of sortedUsers) {

        const member = await guild.members.fetch(userId).catch(() => null);

        if (!member) continue;

        if (!member.roles.cache.has(topRole.id)) {

            await member.roles.add(topRole).catch(() => {});

            const channel = guild.systemChannel;

            if (channel) {
                channel.send(
                    `🏆 ${member} is now one of the **top 5 lyn lovers!**`
                ).catch(() => {});
            }
        }
    }
}

client.once("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {


    if (message.author.bot) return;
    if (!message.guild) return;

    // ===========================
// !changelyn command
// ===========================

if (message.content.toLowerCase().startsWith("!changelyn")) {

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply("❌ Only **Staff** can use this command.");
    }

    const args = message.content.split(" ");

    const target = message.mentions.users.first();

    if (!target) {
        return message.reply(
            "❌ Usage: `!changelyn @user amount`"
        );
    }

    const amount = Number(args[2]);

    if (isNaN(amount) || amount < 0) {
        return message.reply(
            "❌ The amount must be a valid number."
        );
    }

    counts[target.id] = amount;

    saveCounts();

    const member = await message.guild.members.fetch(target.id).catch(() => null);

    if (member) {
        await giveRoles(member);
    }

    return message.reply(
        `✅ Changed **${target.username}**'s lyn count to **${amount} lyns**.`
    );
}

    // ===========================
    // !scan command
    // ===========================

    if (message.content.toLowerCase() === "!scan") {

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply("❌ Only **Staff** can run this command.");
        }

        const progress = await message.reply("🔍 Starting scan...");

        counts = {};

        const channels = message.guild.channels.cache.filter(
            c => c.type === ChannelType.GuildText
        );

        let scanned = 0;

        for (const channel of channels.values()) {

            scanned++;

            await progress.edit(
                `🔍 Scanning **#${channel.name}** (${scanned}/${channels.size})`
            );

            let lastId;

            while (true) {

                const messages = await channel.messages.fetch({
                    limit: 100,
                    before: lastId
                }).catch(() => null);

                if (!messages || messages.size === 0) break;

                messages.forEach(msg => {

                    if (msg.author.bot) return;

                    if (msg.content.toLowerCase().includes("lyn")) {
                        counts[msg.author.id] =
                            (counts[msg.author.id] || 0) + 1;
                    }

                });

                lastId = messages.last().id;
            }
        }

        saveCounts();

        for (const userId in counts) {

            const member = await message.guild.members.fetch(userId).catch(() => null);

            if (member) {
                await giveRoles(member);
            }
        }

        return progress.edit(
            `✅ Scan complete!\n\n👥 Users found: **${Object.keys(counts).length}**`
        );
    }


    // ===========================
    // !lynlovers command
    // ===========================


if (message.content.toLowerCase() === "!lynlovers") {

    const staffRole = message.guild.roles.cache.find(
        role => role.name === "Staff"
    );

    let leaderboard = [];

    for (const userId in counts) {

        const user = await client.users.fetch(userId).catch(() => null);

        if (!user) continue;

        leaderboard.push({
            username: user.username,
            count: counts[userId]
        });
    }
    await updateTopLynLovers(message.guild);

    leaderboard.sort((a, b) => b.count - a.count);

    let text = "💘 **Lyn Lovers ** 💘\n\n";

    leaderboard.forEach((user, index) => {
        text += `${index + 1}. **${user.username}**: ${user.count} lyns\n`;
    });


    // Non-staff
    if (!message.member.roles.cache.has(staffRole.id)) {

        try {
            await message.author.send(
                "❌ You are not allowed to use the `!lynlovers` command in chat.\n\n" +
                "Here are the current Lyn Lovers:\n\n" +
                text
            );

            return message.reply("📩 For flood reasons, you don't have permission to use this command. I sent the stats to your DMs.");

        } catch {
            return message.reply(
                "❌ You are not allowed to use this command, and I couldn't DM you."
            );
        }
    }


    // Staff
    return message.channel.send(text);
}

// ===========================
// !lynhelp command
// ===========================

if (message.content.toLowerCase() === "!lynhelp") {

    let text = "🩷 **Lyn Bot Commands** 🩷\n\n";

    for (const command in commands) {
        text += `\`${command}\`\n> ${commands[command]}\n\n`;
    }

    return message.reply(text);
}

// ===========================
// !lynstats command
// ===========================

if (message.content.toLowerCase() === "!lynstats") {

    const amount = counts[message.author.id] || 0;

    return message.reply(
        `📊 **${message.author.username}'s Lyn Stats**\n\n` +
        ` 🔥 Lyns said: **${amount}**`
    );
}

    // ===========================
    // Count lyn messages
    // ===========================

    if (!message.content.toLowerCase().includes("lyn"))
        return;

    counts[message.author.id] =
        (counts[message.author.id] || 0) + 1;

    saveCounts();

    console.log(`${message.author.tag}: ${counts[message.author.id]}`);

    await giveRoles(message.member);
    await updateTopLynLovers(message.guild);

});

client.login(TOKEN);