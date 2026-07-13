module.exports = {
    name: "lynstats",

    async execute(message, counts) {

        const amount = counts[message.author.id] || 0;

        message.reply(
            `📊 **${message.author.username}'s Lyn Stats**\n\n` +
            `🔥 Lyns said: **${amount}**`
        );

    }
};
const { PermissionsBitField, ChannelType } = require("discord.js");

