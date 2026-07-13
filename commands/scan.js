
 

const { PermissionsBitField, ChannelType } = require("discord.js");

module.exports = {
    name: "scan",

    async execute(message, args, data) {

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply("❌ Only **Staff** can run this command.");
        }

        const progress = await message.reply("🔍 Starting scan...");

        data.counts = {};

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
                        data.counts[msg.author.id] =
                         (data.counts[msg.author.id] || 0) + 1;
                    }

                });

                lastId = messages.last().id;
            }
        }

        data.saveCounts();

        for (const userId in data.counts) {

            const member = await message.guild.members.fetch(userId).catch(() => null);

            if (member) {
                await data.giveRoles(member, message.channel);
            }
        }
        await data.updateTopLynLovers(message.guild, counts);
        return progress.edit(
            `✅ Scan complete!\n\n👥 Users found: **${Object.keys(data.counts).length}**`
        ); 
        
    
    }
};