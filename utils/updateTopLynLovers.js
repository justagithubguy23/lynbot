const TOP_ROLE = "top lyn lover";

async function updateTopLynLovers(guild, counts) {

    const topRole = guild.roles.cache.find(r => r.name === TOP_ROLE);

    if (!topRole) return;

    // Get the top 5 users
    const topUsers = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id]) => id);

   const announcementChannel = guild.channels.cache.find(
    channel =>
        channel.name.toLowerCase() === "general" &&
        channel.isTextBased()
);

console.log("Announcement channel:", announcementChannel?.name);

    // Remove role from users no longer in the top 5
    for (const member of [...topRole.members.values()]) {

        if (!topUsers.includes(member.id)) {

            await member.roles.remove(topRole).catch(console.error);

            console.log(`${member.user.tag} lost Top Lyn Lover.`);

            if (announcementChannel) {
                await announcementChannel.send(
                    `📉 ${member} is no longer one of the **Top 5 Lyn Lovers!**`
                ).catch(() => {});
            }
        }
    }

    // Give role to new top 5 users
    for (const userId of topUsers) {

        const member = await guild.members.fetch(userId).catch(() => null);

        if (!member) continue;

        if (!member.roles.cache.has(topRole.id)) {

            await member.roles.add(topRole).catch(console.error);

            console.log(`${member.user.tag} became a Top Lyn Lover.`);

            if (announcementChannel) {
                await announcementChannel.send(
                    `🏆 ${member} is now one of the **Top 5 Lyn Lovers**, congrats!`
                ).catch(() => {});
            }
        }
    }
}

module.exports = updateTopLynLovers;