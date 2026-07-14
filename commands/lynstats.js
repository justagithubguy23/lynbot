const { blacklist } = require("../utils/blacklist");

module.exports = {
    name: "lynstats",

    async execute(message, args, data) {

        const amount = blacklist.includes(message.author.id)
            ? 0
            : (data.counts[message.author.id] || 0);

        message.reply(
            `📊 **${message.author.username}'s Lyn Stats**\n\n` +
            `🔥 Lyns said: **${amount}**`
        );

    }
};