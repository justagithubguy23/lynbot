module.exports = {

    name: "lynhelp",

    async execute(message, args, data) {

        let text = "🩷 **Lyn Bot Commands** 🩷\n\n";

        for (const [name, command] of data.commands) {

            text += `\`!${name}\`\n`;

        }

        return message.reply(text);

    }

};