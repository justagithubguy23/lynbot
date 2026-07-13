

   
module.exports = {
    name: "lynhelp",

    async execute(message, client, data) {

    let text = "🩷 **Lyn Bot Commands** 🩷\n\n";

    for (const command in commands) {
        text += `\`${command}\`\n> ${commands[command]}\n\n`;
    }

    return message.reply(text);
}


    }
