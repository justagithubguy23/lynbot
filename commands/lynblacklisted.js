const { PermissionsBitField } = require("discord.js");
const { blacklist } = require("../utils/blacklist");

module.exports = {
    name: "lynblacklisted",

    async execute(message, args, data) {

      const STAFF_ROLE_ID = "1439086500984655936"; 

if (!message.member.roles.cache.has(STAFF_ROLE_ID)) {
    return message.reply("❌ To avoid flooding, Only Staff can use this. You can use !lyntop10 instead!");
}

        if (blacklist.length === 0) {
            return message.reply("✅ The Lyn blacklist is empty.");
        }

        let text = "🚫 **Blacklisted Users** 🚫\n\n";

        for (const id of blacklist) {

            const member = await message.guild.members.fetch(id).catch(() => null);

            if (member) {
                text += `• ${member.user.tag} (\`${id}\`)\n`;
            } else {
                text += `• Unknown User (\`${id}\`)\n`;
            }
        }

        return message.reply(text);
    }
};