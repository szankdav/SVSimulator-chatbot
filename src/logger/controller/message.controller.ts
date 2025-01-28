import { getAllMessages, createMessage, MessageModel } from "../model/message.model";
import { SqlParams } from "../types/sqlparams.type";
import { createLetterCountersController } from "./letterCounter.controller";

export const createMessageController = async (messageParams: MessageModel): Promise<void> => {
    try {
        // Kell-e vizsgalni arra, hogy a bejovo adat nem ures, ha tudjuk, hogy ilyen nem fordulhat elo?
        const params: SqlParams = [messageParams.author, messageParams.content, messageParams.messageCreatedAt];
        await createMessage(params);
        await createLetterCountersController(messageParams);
        console.log('Message added to the database!');
    } catch (error) {
        console.error("Error creating message:", error);
    }
}

export const getAllMessagesController = async ():Promise<MessageModel[]> => {
    try {
        return await getAllMessages();
    } catch (error) {
        console.error("Error fetching all messages:", error);
        return [];
    }
}