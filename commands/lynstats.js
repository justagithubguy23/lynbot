module.exports = {
    name: "lynstats",

    async execute(message, args, data) {

        let targetId;

        // If a user is mentioned
        if (message.mentions.users.first()) {
            targetId = message.mentions.users.first().id;
        }

        // If an ID was typed
        else if (args[0] && /^\d+$/.test(args[0])) {
            targetId = args[0];
        }

        // Otherwise show your own stats
        else {
            targetId = message.author.id;
        }


        const targetMember = await message.guild.members.fetch(targetId).catch(() => null);

        const username = targetMember
            ? targetMember.user.username
            : targetId;


        const amount = data.counts[targetId] || 0;


        message.reply(
            `📊 **${username}'s Lyn Stats**\n\n` +
            `🔥 Lyns said: **${amount}**`
        );

    }
};