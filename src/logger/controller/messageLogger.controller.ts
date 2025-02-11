import { createAuthor, getAuthorByName } from "../model/author.model";
import { createMessage, MessageModel } from "../model/message.model";
import { DatabaseError } from "../utils/customErrorClasses/databaseError.class";
import { Database } from "sqlite3";
import { SqlParams } from "../types/sqlparams.type";
import { createLetterCounters, getLetterCounterByAuthorId, updateLetterCounter } from "../model/letterCounter.model";
import { LetterCounterError } from "../utils/customErrorClasses/LetterCounterError.class";
import { AuthorsError } from "../utils/customErrorClasses/authorsError.class";

export const messageLoggerController = async (db: Database, message: {username: string, messageCreatedAt: number, content: string}): Promise<void> => {
    try {
        const messageCreatedAt = new Date(message.messageCreatedAt);
        const authorToCreate: SqlParams = [message.username, messageCreatedAt.toLocaleString()];
        const existingAuthor = await getAuthorByName(db, [message.username]);
        if (!existingAuthor) {
            await createAuthor(db, authorToCreate);
            console.log('Author added to the database!');
        }

        const newAuthorId = await getAuthorByName(db, [message.username]);

        const messageToCreate: MessageModel = {
            id: 0,
            authorId: newAuthorId!.id,
            content: message.content,
            messageCreatedAt: messageCreatedAt.toLocaleString(),
        };

        await createMessage(db, [messageToCreate.authorId, messageToCreate.content, messageToCreate.messageCreatedAt]);
        await createLetterCountersInDatabase(db, messageToCreate);
    } catch (error) {
        console.error("Error logging message:", error);
        throw new DatabaseError("Error logging message", 500);
    }
}

const createLetterCountersInDatabase = async (db: Database, messageParams: MessageModel): Promise<void> => {
    try {
        const existingAuthorId = await checkAuthorIdExistense(db, [messageParams.authorId]);
        if (!existingAuthorId)
            await createLetterCounters(db, [messageParams.authorId, "", 0, messageParams.messageCreatedAt, new Date().toLocaleString()]);
        await letterIterator(db, messageParams);
    } catch (error) {
        console.error("Error creating letters:", error);
        throw new LetterCounterError("Error creating letters", 500);
    }
};

const checkAuthorIdExistense = async (db: Database, params: SqlParams): Promise<{ authorId: number } | undefined> => {
    try {
        return await getLetterCounterByAuthorId(db, params);
    } catch (error) {
        console.error("Error fetching first author:", error);
        throw new AuthorsError("Error fetching first author", 500);
    }
};

const letterIterator = async (db: Database, messageParams: MessageModel): Promise<void> => {
    const validLetters = messageParams.content
        .toLowerCase()
        .split("")
        .filter((char) => /^[a-záéíóöőúüű]$/i.test(char));
    for (let letter of validLetters) {
        const updatedAt = new Date();
        await updateLetterCounter(db, [updatedAt.toLocaleString(), messageParams.authorId, letter]);
    }
};