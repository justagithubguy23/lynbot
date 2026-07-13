const roles = {
    10: "lyn lover`",
    35: "super lyn lover",
    50: "mega lyn lover",
    75: "ultimate lyn lover"
};


async function giveRoles(member, channel) {

    const counts = require("./counts").counts;

    const total = counts[member.id] || 0;


    for (const milestone of Object.keys(roles)
        .map(Number)
        .sort((a, b) => a - b)) {


        if (total < milestone) continue;


        const role = member.guild.roles.cache.find(
            r => r.name === roles[milestone]
        );


        if (!role) continue;


        if (!member.roles.cache.has(role.id)) {

            await member.roles.add(role);

            console.log(
                `${member.user.tag} earned ${role.name}`
            );


            if (channel) {

                await channel.send(
                    `🎉 ${member} has unlocked the **${role.name}** role!`
                ).catch(() => {});

            }
        }
    }
}


module.exports = {
    giveRoles
};
