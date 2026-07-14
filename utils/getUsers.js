module.exports = async function getUser(message, input) {
    if (!input) return null;

    const mentioned = message.mentions.users.first();
    if (mentioned) return mentioned;

    return await message.client.users.fetch(input).catch(() => null);
};