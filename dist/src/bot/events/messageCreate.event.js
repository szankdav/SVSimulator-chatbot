import { logDiscordMessage } from "../../logger/controller/messageCreateEvent.controller";
import { db } from "../../logger/database/database";
export async function createMessage(message) {
    try {
        if (message.author.bot)
            return;
        if (message.content.startsWith('<@'))
            return;
        await logDiscordMessage(db, message);
    }
    catch (error) {
        console.error("Error creating message:", error);
    }
}
export async function answerBotMention(message) {
    if (message.author.bot)
        return;
    if (message.mentions.users.has("1328702124413943830")) {
        message.channel.send(`Szia ${message.author}!`);
        message.channel.send(`Az elérhető parancsaimat a "/" jellel tudod előhozni! :)`);
    }
}
