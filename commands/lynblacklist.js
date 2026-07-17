const { PermissionsBitField } = require("discord.js");
const { blacklist, saveBlacklist } = require("../utils/blacklist");

module.exports = {
    name: "lynblacklist",

    async execute(message, args, data) {

        const STAFF_ROLE_ID = "123456789012345678";

if (!message.member.roles.cache.has(STAFF_ROLE_ID)) {
    return message.reply("❌ Only Staff can use this.");
}

        const id =
            message.mentions.users.first()?.id ||
            args[0];

        if (!id)
            return message.reply(
                "Usage: `!lynblacklist @user` or `!lynblacklist userid`"
            );

        if (!blacklist.includes(id)) {
            blacklist.push(id);
            saveBlacklist();
        }

        delete data.counts[id];
        data.saveCounts();

        const member = await message.guild.members.fetch(id).catch(() => null);

        if (member) {

            const role = message.guild.roles.cache.find(
                r => r.name.toLowerCase() === "lyn blacklisted"
            );

            if (role)
                await member.roles.add(role).catch(() => {});
        }

        await data.updateTopLynLovers(message.guild, data.counts);

        message.reply(`✅ User \`${id}\` has been blacklisted.`);
    }
};