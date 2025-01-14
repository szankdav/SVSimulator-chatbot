const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    execute(message) {
        console.log(`User: ${message.author.displayName}, message: ${message.content}, created at: ${message.createdAt}`);
    },
};