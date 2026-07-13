require("dotenv").config();

const { Client, GatewayIntentBits, ChannelType, PermissionsBitField } = require("discord.js");

const scanCommand = require("./commands/scan");
const lynhelpCommand = require("./commands/lynhelp");
const changelynCommand = require("./commands/changelyn");
const lynloversCommand = require("./commands/lynlovers");
const lynstatsCommand = require("./commands/lynstats");


const fs = require("fs");
const path = require("path");

const commands = new Map();

const commandFiles = fs
    .readdirSync(path.join(__dirname, "commands"))
    .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {

    const command = require(`./commands/${file}`);

    commands.set(command.name, command);

}

const botData = {
    counts,
    saveCounts,
    giveRoles,
    updateTopLynLovers
};


console.log(`Loaded ${commands.size} commands.`);

const updateTopLynLovers = require("./utils/updateTopLynLovers");

const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Bot is running!");
});

app.listen(8000, () => {
    console.log("Web server running on port 8000");
});



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

if (message.content.toLowerCase() === "!scan") {

    return scanCommand.execute(
        message,
        client,
        counts,
        saveCounts,
        giveRoles,
        updateTopLynLovers
    );

}


client.on("messageCreate", async (message) => {


    if (!message.content.startsWith("!"))
    return;

    const commandName =
    message.content.slice(1).split(" ")[0].toLowerCase();

const command = commands.get(commandName);

if (command) {

    return command.execute(
        message,
        client,
        botData
    );

}


    if (message.author.bot) return;
    if (!message.guild) return;

 


  
    


   








    // ===========================
    // Count lyn messages
    // ===========================

    if (!message.content.toLowerCase().includes("lyn"))
        return;

    counts[message.author.id] =
        (counts[message.author.id] || 0) + 1;

    saveCounts();

    console.log(`${message.author.tag}: ${counts[message.author.id]}`);

    await giveRoles(message.member, message.channel);
    await updateTopLynLovers(message.guild, counts);

});

client.login(TOKEN);