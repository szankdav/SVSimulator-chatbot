import { getAllMessages, createMessage, getTenMessages, getMessagesByAuthorId } from "../model/message.model";
import { DatabaseError } from "../middleware/databaseError.handler";
export const createMessageController = async (db, messageParams) => {
    try {
        const params = [messageParams.authorId, messageParams.content, messageParams.messageCreatedAt];
        await createMessage(db, params);
        console.log('Message added to the database!');
    }
    catch (error) {
        console.error("Error creating message:", error);
        throw new DatabaseError("Error creating message", 500);
    }
};
export const getAllMessagesController = async (db) => {
    try {
        return await getAllMessages(db);
    }
    catch (error) {
        console.error("Error fetching all messages:", error);
        throw new DatabaseError("Error fetching all messages", 500);
    }
};
export const getMessagesByAuthorIdController = async (db, params) => {
    try {
        return await getMessagesByAuthorId(db, params);
    }
    catch (error) {
        console.error("Error fetching messages by author id:", error);
        throw new DatabaseError("Error messages by author id", 500);
    }
};
export const getTenMessagesController = async (db, params) => {
    try {
        return await getTenMessages(db, params);
    }
    catch (error) {
        console.error("Error fetching ten messages:", error);
        throw new DatabaseError("Error fetching ten messages", 500);
    }
};
