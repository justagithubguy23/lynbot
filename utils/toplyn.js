const TOP_ROLE = "top lyn lover";

async function updateTopLynLovers(guild, counts) {

    const topRole = guild.roles.cache.find(
        role => role.name === TOP_ROLE
    );

    if (!topRole) return;


    const sortedUsers = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(entry => entry[0]);


    // Remove role from people no longer top 5
    for (const member of topRole.members.values()) {

        if (!sortedUsers.includes(member.id)) {

            await member.roles.remove(topRole)
                .catch(() => {});

            console.log(
                `${member.user.tag} lost Top Lyn Lover role`
            );
        }
    }


    // Give role to new top 5
    for (const userId of sortedUsers) {

        const member = await guild.members.fetch(userId)
            .catch(() => null);

        if (!member) continue;


        if (!member.roles.cache.has(topRole.id)) {

            await member.roles.add(topRole)
                .catch(() => {});

            console.log(
                `${member.user.tag} became a Top Lyn Lover`
            );
        }
    }
}


module.exports = {
    updateTopLynLovers
};