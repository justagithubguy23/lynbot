const { PermissionsBitField } = require("discord.js");
const { counts } = require("../utils/counts");
const { giveRoles } = require("../utils/giveroles");
const updateTopLynLovers = require("../utils/updateTopLynLovers");

module.exports = {
    name: "changelyn",

    async execute(message, args, data) {

        
        const STAFF_ROLE_ID = "1439086500984655936";

if (!message.member.roles.cache.has(STAFF_ROLE_ID)) {
    return message.reply("❌ Only Staff can use this.");
}

        let target = message.mentions.users.first();

// If no mention, try treating the first argument as a user ID
if (!target && args[0]) {
    target = await message.client.users.fetch(args[0]).catch(() => null);
}

if (!target) {
    return message.reply(
        "❌ Usage: `!changelyn @user amount`\nor\n`!changelyn <userID> amount`"
    );
}

const amount = Number(args[1]);

        if (isNaN(amount) || amount < 0) {
            return message.reply("❌ The amount must be a valid number.");
        }

        counts[target.id] = amount;

        data.saveCounts();

        const member = await message.guild.members.fetch(target.id).catch(() => null);

        if (member) {
            await giveRoles(member, message.channel);
        }

        await updateTopLynLovers(message.guild, counts);

        return message.reply(
            `✅ Changed **${target.username}**'s lyn count to **${amount} lyns**.`
        );
    }
};