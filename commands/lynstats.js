module.exports = {
    name: "lynstats",

    async execute(message, args, data) {

        let targetId;

        // If a user mention was used
        const mentionedUser = message.mentions.users.first();

        if (mentionedUser) {
            targetId = mentionedUser.id;
        }

        // If a raw ID was used
        else if (args[0] && /^\d+$/.test(args[0])) {
            targetId = args[0];
        }

        // Otherwise show your own stats
        else {
            targetId = message.author.id;
        }


        const amount = data.counts[targetId] || 0;


        let username = "Unknown User";

        const member = await message.guild.members.fetch(targetId).catch(() => null);

        if (member) {
            username = member.user.username;
        }
        else if (targetId === message.author.id) {
            username = message.author.username;
        }


        return message.reply(
            `📊 **${username}'s Lyn Stats**\n\n` +
            `🔥 Lyns said: **${amount}**`
        );

    }
};