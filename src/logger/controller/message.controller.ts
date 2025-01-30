import { Database } from "sqlite3";
import { getAllMessages, createMessage, MessageModel } from "../model/message.model";
import { SqlParams } from "../types/sqlparams.type";
import { createLetterCountersController } from "./letterCounter.controller";
import { DatabaseError } from "../middleware/databaseError.handler";

export const createMessageController = async (db: Database, messageParams: MessageModel): Promise<void> => {
    try {
        // Kell-e vizsgalni arra, hogy a bejovo adat nem ures, ha tudjuk, hogy ilyen nem fordulhat elo?
        const params: SqlParams = [messageParams.authorId, messageParams.content, messageParams.messageCreatedAt];
        await createMessage(db, params);
        await createLetterCountersController(db, messageParams);
        console.log('Message added to the database!');
    } catch (error) {
        console.error("Error creating message:", error);
        throw new DatabaseError("Error creating message", 500);
    }
}

export const getAllMessagesController = async (db: Database):Promise<MessageModel[]> => {
    try {
        return await getAllMessages(db);
    } catch (error) {
        console.error("Error fetching all messages:", error);
        throw new DatabaseError("Error fetching all messages", 500);
    }
}