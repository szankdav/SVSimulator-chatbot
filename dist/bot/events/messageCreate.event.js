var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
async function createMessage(message) {
  try {
    if (message.author.bot) return;
    if (message.content.startsWith("<@")) return;
    const messageData = {
      username: message.author.globalName,
      messageCreatedAt: message.createdTimestamp,
      content: message.content
    };
    const result = await fetch("http://localhost:3000/logMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: messageData })
    });
    const response = await result.json();
    console.log(response);
  } catch (error) {
    console.error("Error creating message:", error);
  }
}
__name(createMessage, "createMessage");
async function answerBotMention(message) {
  if (message.author.bot) return;
  if (message.mentions.users.has("1328702124413943830")) {
    message.channel.send(`Szia ${message.author}!`);
    message.channel.send(`Az el\xE9rhet\u0151 parancsaimat a "/" jellel tudod el\u0151hozni! :)`);
  }
}
__name(answerBotMention, "answerBotMention");
export {
  answerBotMention,
  createMessage
};
