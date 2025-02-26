var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { logger } from "../../winston/winston.js";
async function createMessage(message) {
  try {
    if (message.author.bot) return;
    if (message.content.startsWith("<@")) return;
    let messageWithoutMemberId = message.content;
    const mentionedUsers = message.mentions.users;
    for (const user of mentionedUsers) {
      messageWithoutMemberId = messageWithoutMemberId.replace(`<@${user[0]}>`, user[1].username);
    }
    const messageData = {
      username: message.author.globalName,
      messageCreatedAt: message.createdTimestamp,
      content: messageWithoutMemberId
    };
    const result = await fetch("http://localhost:3000/logMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: messageData })
    });
    if (result.status === 200) {
      logger.info(`Message logged by user: ${message.author.globalName}`);
    }
  } catch (error) {
    logger.error("Error creating message:", error);
  }
}
__name(createMessage, "createMessage");
async function answerBotMention(message) {
  if (message.author.bot) return;
  const user = message.mentions.users.first();
  if (user === void 0) {
    return;
  }
  if (user.username === "SVSimulator Sven") {
    message.channel.send(`Szia ${message.author}!`);
    message.channel.send(`Az el\xE9rhet\u0151 parancsaimat a "/" jellel tudod el\u0151hozni! :)`);
    logger.info(`SVSimulator Sven mentioned by: ${message.author}`);
  }
}
__name(answerBotMention, "answerBotMention");
export {
  answerBotMention,
  createMessage
};
