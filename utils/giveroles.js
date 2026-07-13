async function giveRoles(member, channel) {

    const total = counts[member.id] || 0;

    for (const milestone of Object.keys(roles).map(Number).sort((a, b) => a - b)) {

        if (total < milestone) continue;

        const role = member.guild.roles.cache.find(
            r => r.name === roles[milestone]
        );

        if (!role) continue;

        if (!member.roles.cache.has(role.id)) {

            await member.roles.add(role);

            console.log(`${member.user.tag} earned ${role.name}`);

            if (channel) {
                await channel.send(
                    `🎉 ${member} has unlocked the **${role.name}** role!`
                ).catch(console.error);
            }
        }
    }
}

async function updateTopLynLovers(guild) {

    const topRole = guild.roles.cache.find(r => r.name === TOP_ROLE);

    if (!topRole) return;

    // Sort users by lyn count
    const sortedUsers = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(entry => entry[0]);

    // Remove role from anyone no longer in top 5
    for (const member of topRole.members.values()) {

        if (!sortedUsers.includes(member.id)) {
            await member.roles.remove(topRole).catch(() => {});
        }

    }

    // Give role to current top 5
    for (const userId of sortedUsers) {

        const member = await guild.members.fetch(userId).catch(() => null);

        if (!member) continue;

        if (!member.roles.cache.has(topRole.id)) {

            await member.roles.add(topRole).catch(() => {});

            const channel = guild.systemChannel;

            if (channel) {
                channel.send(
                    `🏆 ${member} is now one of the **top 5 lyn lovers!**`
                ).catch(() => {});
            }
        }
    }
}

client.once("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    
});
module.exports = giveRoles;
