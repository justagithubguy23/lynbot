require("dotenv").config();

const { Client, GatewayIntentBits, ChannelType, PermissionsBitField, Collection } = require("discord.js");

const { giveRoles } = require("./utils/giveroles");

const { counts, saveCounts } = require("./utils/counts");

const scanCommand = require("./commands/scan");
const lynhelpCommand = require("./commands/lynhelp");
const changelynCommand = require("./commands/changelyn");
const lynloversCommand = require("./commands/lynlovers");
const lynstatsCommand = require("./commands/lynstats");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});



const fs = require("fs"); 

console.log("Current folder:");
console.log(fs.readdirSync("."));

console.log("Utils folder:");
console.log(fs.readdirSync("./utils"));

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


console.log(fs.readdirSync("./utils"));



console.log(
    `Loaded ${client.commands.size} commands.`
);



const updateTopLynLovers = require("./utils/updateTopLynLovers");

const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Bot is running!");
});

app.listen(8000, () => {
    console.log("Web server running on port 8000");
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









const botData = {

    counts,
    saveCounts,
    giveRoles,
    updateTopLynLovers,
    commands: client.commands
    
};


client.on("messageCreate", async message => {

    if (message.author.bot) return;

    const args = message.content.split(" ");
    const cmd = args.shift().toLowerCase();

    if (cmd.startsWith("!")) {

        const command = client.commands.get(cmd.substring(1));

        if (command) {
            await command.execute(
                message,
                args,
                botData
            );
        }
    }


    if (!message.content.toLowerCase().includes("lyn"))
        return;


    counts[message.author.id] =
        (counts[message.author.id] || 0) + 1;


    saveCounts();

    console.log(
        `${message.author.tag}: ${counts[message.author.id]}`
    );


    await giveRoles(
        message.member,
        message.channel
    );


    await updateTopLynLovers(
        message.guild,
        counts
    );

     await updateTopLynLovers(message.guild, counts);

});

    
    

   

  
    


   










    


client.login(TOKEN);