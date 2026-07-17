const { PermissionsBitField } = require("discord.js");
const { blacklist, saveBlacklist } = require("../utils/blacklist");

module.exports = {
    name: "lynunblacklist",

    async execute(message, args, data) {

       
        const STAFF_ROLE_ID = "123456789012345678";

if (!message.member.roles.cache.has(STAFF_ROLE_ID)) {
    return message.reply("❌ Only Staff can use this.");
}

        const id =
            message.mentions.users.first()?.id ||
            args[0];

        if (!id) {
            return message.reply(
                "❌ Usage: `!lynunblacklist @user` or `!lynunblacklist userid`"
            );
        }

        if (!blacklist.includes(id)) {
            return message.reply("❌ That user isn't blacklisted.");
        }

        // Remove from blacklist
        blacklist.splice(blacklist.indexOf(id), 1);
        saveBlacklist();

        // Remove role if they're in the server
        const member = await message.guild.members.fetch(id).catch(() => null);

        if (member) {
            const role = message.guild.roles.cache.find(
                r => r.name.toLowerCase() === "lyn blacklisted"
            );

            if (role && member.roles.cache.has(role.id)) {
                await member.roles.remove(role).catch(() => {});
            }
        }

        // Recalculate leaderboard
        await data.updateTopLynLovers(
            message.guild,
            data.counts
        );

        return message.reply(
            `✅ User \`${id}\` has been unblacklisted.`
        );
    }
};