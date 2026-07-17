
 

const { PermissionsBitField, ChannelType } = require("discord.js");

module.exports = {
    name: "scan",

    async execute(message, args, data) {

        console.log("Scan command started");

        const STAFF_ROLE_ID = "123456789012345678";

if (!message.member.roles.cache.has(STAFF_ROLE_ID)) {
    return message.reply("❌ Only Staff can use this.");
}
        const { blacklist } = require("../utils/blacklist");
        const progress = await message.reply("🔍 Starting scan...");

        for (const key in data.counts) {
    delete data.counts[key];
}

        const channels = message.guild.channels.cache.filter(
            c => c.type === ChannelType.GuildText
        );

        let scanned = 0;

        for (const channel of channels.values()) {

            console.log("Scanning channel:", channel.name);

            scanned++;

            await progress.edit(
                `🔍 Scanning **#${channel.name}** (${scanned}/${channels.size})`
            );

            let lastId;

            while (true) {

                
                 const messages = await channel.messages.fetch({
                    limit: 100,
                    before: lastId
                    }).catch(err => {
                    console.log("FETCH ERROR:", channel.name, err);
                     return null;
                     });

                if (!messages || messages.size === 0) break;

                messages.forEach(msg => {

                   if (msg.author.bot) return;

                    if (blacklist.includes(msg.author.id))
                       return;

                    if (msg.content.toLowerCase().includes("lyn")) {
                        data.counts[msg.author.id] =
                         (data.counts[msg.author.id] || 0) + 1;
                    }

                });

                console.log(channel.name, "Fetched", messages?.size, "messages");

                const newLastId = messages.last().id;

                   if (newLastId === lastId) {
             console.log("Same message ID, stopping loop");
                         break;
                          }

                      lastId = newLastId;
            }

           console.log("Finished channel:", channel.name); 
        }
        console.log("Saving counts...");
        data.saveCounts();

        for (const userId in data.counts) {

            const member = await message.guild.members.fetch(userId).catch(() => null);
              console.log("Updating roles...");
            if (member) {
                await data.giveRoles(member, message.channel);
            }
        }
        console.log(data.counts);
        console.log("Users:", Object.keys(data.counts).length);
        console.log("Updating leaderboard...");
        await data.updateTopLynLovers(message.guild, data.counts);
        console.log("Leaderboard updated.");
        await progress.edit(
            `✅ Scan complete!\n\n👥 Users found: **${Object.keys(data.counts).length}**`
        ); 
        console.log("Done!");
        
    
    }
};