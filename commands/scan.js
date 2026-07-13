
 

const { PermissionsBitField, ChannelType } = require("discord.js");

module.exports = {
    name: "scan",

    async execute(message, client, counts, saveCounts, giveRoles, updateTopLynLovers) {

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
                await giveRoles(member, message.channel);;
            }
        }

        return progress.edit(
            `✅ Scan complete!\n\n👥 Users found: **${Object.keys(counts).length}**`
        ); 
        await updateTopLynLovers(message.guild, counts);
    
    }
};