module.exports = {
    name: "lyntop10",

    async execute(message, args, data) {

        const sorted = Object.entries(data.counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        if (sorted.length === 0) {
            return message.reply("No lyns have been recorded yet.");
        }

        let text = "🏆 **Top 10 Lyn Lovers** 🏆\n\n";

        let place = 1;

        for (const [userId, amount] of sorted) {

            let username = `<@${userId}>`;

            try {
                const user = await message.client.users.fetch(userId);
                username = user.username;
            } catch {}

            const medals = {
                1: "🥇",
                2: "🥈",
                3: "🥉",
                4: "🏆",
                5: "🏆"
            };

            text += `${medals[place] || `**${place}.**`} ${username} — **${amount}** lyns\n`;
            place++;
        }

        message.reply(text);
    }
};