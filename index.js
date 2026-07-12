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

const { Client, GatewayIntentBits, ChannelType, PermissionsBitField } = require("discord.js");
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
const roles = {
    10: "lyn lover`",
    35: "super lyn lover",
    75: "ultimate lyn lover"
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
    // !scan command
    // ===========================

    if (message.content.toLowerCase() === "!scan") {

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply("❌ You need Administrator permissions.");
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

    // keep your leaderboard here


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

});

client.login(TOKEN);