const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    execute(message) {
        if (message.author.bot) return;
        console.log(`User: ${message.author.displayName}, message: ${message.content}, created at: ${message.createdAt}`);
        message.reply(`Szia, ${message.author.displayName}! Láttam, hogy ezt írtad: "${message.content}"`);
    },
};