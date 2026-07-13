
module.exports = {
    name: "lynlovers",

    async execute(message, client, counts, saveCounts, giveRoles, updateTopLynLovers) {

       

    const staffRole = message.guild.roles.cache.find(
        role => role.name === "Staff"
    );

    let leaderboard = [];

    for (const userId in counts) {

        const user = await client.users.fetch(userId).catch(() => null);

        if (!user) continue;

        leaderboard.push({
            username: user.username,
            count: counts[userId]
        });
    }
    await updateTopLynLovers(message.guild, counts);

    leaderboard.sort((a, b) => b.count - a.count);

    let text = "💘 **Lyn Lovers ** 💘\n\n";

    leaderboard.forEach((user, index) => {
        text += `${index + 1}. **${user.username}**: ${user.count} lyns\n`;
    });


    // Non-staff
    if (!message.member.roles.cache.has(staffRole.id)) {

        try {
            await message.author.send(
                "❌ You are not allowed to use the `!lynlovers` command in chat.\n\n" +
                "Here are the current Lyn Lovers:\n\n" +
                text
            );

            return message.reply("📩 For flood reasons, you don't have permission to use this command. I sent the stats to your DMs.");

        } catch {
            return message.reply(
                "❌ You are not allowed to use this command, and I couldn't DM you."
            );
        }
    }


    // Staff
    return message.channel.send(text);



    }
};