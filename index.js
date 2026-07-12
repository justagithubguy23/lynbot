require("dotenv").config();

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
    15: "lyn lover`",
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
    // ===========================
// !lynlovers leaderboard
// ===========================

// ===========================
// !lynlovers leaderboard
// ===========================

// ===========================
// !lynlovers leaderboard
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

    leaderboard.sort((a, b) => b.count - a.count);

    let text = " **Lyn Lovers** \n\n";

    leaderboard.forEach((user, index) => {
        text += `${index + 1}. **${user.username}**: ${user.count} lyns\n`;
    });


    // Non-staff
    if (!message.member.roles.cache.has(staffRole.id)) {

        try {
            await message.author.send(
                "❌ You are not allowed to use the `!lynlovers` command.\n\n" +
                "Here are the current Lyn Lovers stats anyway:\n\n" +
                text
            );

            return message.reply("📩To avoid flooding, you don't have permission to use this command, but I sent the stats to your DMs.");

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
    // Count "lyn"
    // ===========================

    if (!message.content.toLowerCase().includes("lyn"))
        return;

    counts[message.author.id] =
        (counts[message.author.id] || 0) + 1;

    saveCounts();

    console.log(
        `${message.author.tag}: ${counts[message.author.id]}`
    );

    await giveRoles(message.member);

});

client.login(TOKEN);