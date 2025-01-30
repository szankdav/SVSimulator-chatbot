import { Message, OmitPartialGroupDMChannel } from "discord.js";
import { createMessageController } from "../../logger/controller/message.controller";
import { createAuthorController } from "../../logger/controller/author.controller";
import { getAuthorByNameController } from "../../logger/controller/author.controller";
import { MessageModel } from "../../logger/model/message.model";
import { db } from "../../logger/database/database";
import { AuthorModel } from "../../logger/model/author.model";

export async function createMessage(message: OmitPartialGroupDMChannel<Message<boolean>>) {
  try {
    if (message.author.bot) return;
    if (message.content.startsWith('<@')) return;

    const authorToCreate: AuthorModel = {
      id: 0,
      name: message.author.displayName,
      createdAt: message.createdAt.toLocaleString(),
    }

    await createAuthorController(db, authorToCreate);

    const newAuthorId = await getAuthorByNameController(db, message.author.displayName);

    const messageToCreate: MessageModel = {
      id: 0,
      authorId: newAuthorId!.id,
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