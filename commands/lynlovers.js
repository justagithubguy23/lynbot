const { counts } = require("../utils/counts");
const { updateTopLynLovers } = require("../utils/topLyn");


module.exports = {

    name: "lynlovers",


    async execute(message) {

    const STAFF_ROLE_ID = "123456789012345678";

if (!message.member.roles.cache.has(STAFF_ROLE_ID)) {
    return message.reply("❌ To avoid flooding, Only Staff can use this.");
}

        await updateTopLynLovers(
            message.guild,
            counts
        );


        let leaderboard = [];


        for (const userId in counts) {

            const user = await message.client.users.fetch(userId)
                .catch(()=>null);


            if (!user) continue;


            leaderboard.push({
                username:user.username,
                count:counts[userId]
            });

        }


        leaderboard.sort(
            (a,b)=>b.count-a.count
        );


        let text = "💘 **Lyn Lovers** 💘\n\n";


        leaderboard.forEach((user,index)=>{

            text += `${index+1}. **${user.username}**: ${user.count} lyns\n`;

        });


        message.channel.send(text);

    }

};