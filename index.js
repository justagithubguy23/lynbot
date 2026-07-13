require("dotenv").config();

const { Client, GatewayIntentBits, ChannelType, PermissionsBitField } = require("discord.js");

const scanCommand = require("./commands/scan");
const lynhelpCommand = require("./commands/lynhelp");
const changelynCommand = require("./commands/changelyn");
const lynloversCommand = require("./commands/lynlovers");
const lynstatsCommand = require("./commands/lynstats");


const fs = require("fs");
const path = require("path");

client.commands = new Collection();


const commandFiles = fs.readdirSync("./commands");


for(const file of commandFiles){

    const command = require(`./commands/${file}`);

    client.commands.set(
        command.name,
        command
    );

}


console.log(
    `Loaded ${client.commands.size} commands.`
);

client.on("messageCreate", async message=>{

    if(message.author.bot) return;


    const args = message.content.split(" ");

    const cmd = args.shift().toLowerCase();


    if(!client.commands.has(cmd.substring(1))) return;


    const command = client.commands.get(
        cmd.substring(1)
    );


    await command.execute(message,args);

});

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






if (fs.existsSync("counts.json"))
try {
    counts = JSON.parse(fs.readFileSync("counts.json", "utf8"));
} catch (error) {
    console.log("⚠️ counts.json was corrupted, creating a new one.");
    counts = {};
    saveCounts();
}



const botData = {

    counts,
    saveCounts,
    giveRoles,
    updateTopLynLovers,
    commands

};


client.on("messageCreate", async (message) => {


    if (!message.content.startsWith("!"))
    return;

    const commandName =
    message.content.slice(1).split(" ")[0].toLowerCase();

const command = commands.get(commandName);

if (command) {

    await command.execute(
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