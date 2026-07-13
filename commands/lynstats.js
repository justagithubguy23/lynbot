module.exports = {
    name: "lynstats",

    async execute(message, args, data) {

        const amount = data.counts[message.author.id] || 0;

        return message.reply(
            `📊 **${message.author.username}'s Lyn Stats**\n\n` +
            `🔥 Lyns said: **${amount}**`
        );
    }
};