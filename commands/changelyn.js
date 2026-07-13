const { PermissionsBitField } = require("discord.js");
const { counts } = require("../utils/counts");
const { giveRoles } = require("../utils/giveroles");
const updateTopLynLovers = require("../utils/updateTopLynLovers");

module.exports = {
    name: "changelyn",

    async execute(message, args, data) {

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply("❌ Only **Staff** can use this command.");
        }

        const target = message.mentions.users.first();

        if (!target) {
            return message.reply("❌ Usage: `!changelyn @user amount`");
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