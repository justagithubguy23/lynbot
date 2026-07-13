const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: "changelyn",

    async execute(message, client, counts, saveCounts, giveRoles, updateTopLynLovers) {

        
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply("❌ Only **Staff** can use this command.");
    }

    const args = message.content.split(" ");

    const target = message.mentions.users.first();

    if (!target) {
        return message.reply(
            "❌ Usage: `!changelyn @user amount`"
        );
    }

    const amount = Number(args[2]);

    if (isNaN(amount) || amount < 0) {
        return message.reply(
            "❌ The amount must be a valid number."
        );
    }

    counts[target.id] = amount;

    saveCounts();

    const member = await message.guild.members.fetch(target.id).catch(() => null);

    if (member) {
        await giveRoles(member, message.channel);;
    }

    return message.reply(
        `✅ Changed **${target.username}**'s lyn count to **${amount} lyns**.`
    ); 
    await updateTopLynLovers(message.guild, counts);
}

    }
