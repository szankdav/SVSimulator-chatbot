import { Message, OmitPartialGroupDMChannel } from "discord.js";
import { createMessageController } from "../../logger/controller/message.controller";
import { MessageModel } from "../../logger/model/message.model";
import { db } from "../../logger/database/database";

export async function createMessage(message: OmitPartialGroupDMChannel<Message<boolean>>) {
  try {
    if (message.author.bot) return;
    if (message.content.startsWith('<@')) return;
    const messageToCreate: MessageModel = {
      id: 0,
      author: message.author.displayName,
      content: message.content,
      messageCreatedAt: message.createdAt.toLocaleString(),
    };
    await createMessageController(db, messageToCreate);
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