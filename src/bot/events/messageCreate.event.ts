import { Message, OmitPartialGroupDMChannel } from "discord.js";

export async function createMessage(message: OmitPartialGroupDMChannel<Message<boolean>>) {
  try {
    if (message.author.bot) return;
    if (message.content.startsWith('<@')) return;

    const messageData = {
      username: message.author.globalName,
      messageCreatedAt: message.createdTimestamp,
      content: message.content,
    }

    const result = await fetch("http://localhost:3000/logMessage", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: messageData }),
    })

    const response = await result.json();
    console.log(response);
  } catch (error) {
    console.error("Error creating message:", error);
  }
}

export async function answerBotMention(message: OmitPartialGroupDMChannel<Message<boolean>>) {
  if (message.author.bot) return;

  if (message.mentions.users.has("1328702124413943830")) {
    message.channel.send(`Szia ${message.author}!`);
    message.channel.send(`Az elérhető parancsaimat a "/" jellel tudod előhozni! :)`);
  }
}