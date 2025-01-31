import { Message, OmitPartialGroupDMChannel } from "discord.js";
import { AuthorModel } from "../model/author.model";
import { createAuthorController, getAuthorByNameController } from "./author.controller";
import { MessageModel } from "../model/message.model";
import { createMessageController } from "./message.controller";
import { createLetterCountersController } from "./letterCounter.controller";
import { DatabaseError } from "../middleware/databaseError.handler";
import { Database } from "sqlite3";

export const logDiscordMessage = async (db: Database, message: OmitPartialGroupDMChannel<Message<boolean>>): Promise<void> => {
    try {
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
        await createLetterCountersController(db, messageToCreate);
    } catch (error) {
        console.error("Error logging message:", error);
        throw new DatabaseError("Error logging message", 500);
    }
}