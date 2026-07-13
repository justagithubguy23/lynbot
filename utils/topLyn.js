const TOP_ROLE = "top lyn lover";


async function updateTopLynLovers(guild, counts){


    const topRole = guild.roles.cache.find(
        r => r.name === TOP_ROLE
    );


    if (!topRole) return;


    const topUsers = Object.entries(counts)
        .sort((a,b)=>b[1]-a[1])
        .slice(0,5)
        .map(x=>x[0]);



    // remove people who are no longer top 5

    for(const member of topRole.members.values()){

        if(!topUsers.includes(member.id)){

            await member.roles.remove(topRole)
                .catch(()=>{});

            console.log(
                `${member.user.username} lost Top Lyn Lover`
            );
        }

    }



    // give role to top 5

    for(const id of topUsers){

        const member = await guild.members.fetch(id)
            .catch(()=>null);


        if(!member) continue;


        if(!member.roles.cache.has(topRole.id)){


            await member.roles.add(topRole)
                .catch(()=>{});


            console.log(
                `${member.user.username} became a Top Lyn Lover.`
            );

        }

    }

}


module.exports = {
    updateTopLynLovers
};
