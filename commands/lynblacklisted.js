const { PermissionsBitField } = require("discord.js");
const { blacklist } = require("../utils/blacklist");

module.exports = {
    name: "lynblacklisted",

    async execute(message, args, data) {

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply("❌ Only staff can use this command.");
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