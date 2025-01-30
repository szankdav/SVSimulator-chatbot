import { Database } from "sqlite3";
import { createLetterCounters, updateLetterCounter, getLetterCounterByAuthorId, getAllLetterCounters, getAllLetterCountersAuthors, LetterModel } from "../model/letterCounter.model";
import { MessageModel } from "../model/message.model";
import { SqlParams } from "../types/sqlparams.type";
import { DatabaseError } from "../middleware/databaseError.handler";

export const createLetterCountersController = async (db: Database, messageParams: MessageModel): Promise<void> => {
    try {
        const existingAuthorId = await checkAuthorIdExistense(db, [messageParams.authorId]);
        if (!existingAuthorId)
            await createLetterCounters(db, [messageParams.authorId, "", 0, messageParams.messageCreatedAt, new Date().toLocaleString()]);
        await letterIterator(db, messageParams);
    } catch (error) {
        console.error("Error creating letters:", error);
        throw new DatabaseError("Error creating letters", 500);
    }
};

export const getAllLetterCountersController = async (db: Database): Promise<LetterModel[]> => {
    try {
        return await getAllLetterCounters(db);
    } catch (error) {
        console.error("Error fetching all letters:", error);
        throw new DatabaseError("Error fetching all letters:", 500);
    }
};

export const getAllLetterCountersAuthorsController = async (db: Database): Promise<{ author: string }[]> => {
    try {
        return await getAllLetterCountersAuthors(db);
    } catch (error) {
        console.error("Error fetching all authors:", error);
        throw new DatabaseError("Error fetching all authors", 500);
    }
}

const checkAuthorIdExistense = async (db: Database, params: SqlParams): Promise<{ authorId: number } | undefined> => {
    try {
        return await getLetterCounterByAuthorId(db, params);
    } catch (error) {
        console.error("Error fetching first author:", error);
        throw new DatabaseError("Error fetching first author", 500);
    }
};

const letterIterator = async (db: Database, messageParams: MessageModel): Promise<void> => {
    const validLetters = messageParams.content
        .toLowerCase()
        .split("")
        .filter((char) => /^[a-záéíóöőúüű]$/i.test(char));
    for (let letter of validLetters) {
        await updateLetterCounter(db, [messageParams.authorId, letter]);
    }
};
