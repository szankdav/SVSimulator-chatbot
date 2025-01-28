import { createLetterCounters, updateLetterCounter, getFirstLetterCounterAuthorByAuthor, getAllLetterCounters, getAllLetterCountersAuthors, LetterModel } from "../model/letterCounter.model";
import { MessageModel } from "../model/message.model";
import { SqlParams } from "../types/sqlparams.type";

export const createLetterCountersController = async (messageParams: MessageModel): Promise<void> => {
    try {
        const existingAuthor = await checkAuthorExistense([messageParams.author]);
        if (!existingAuthor)
            await createLetterCounters([messageParams.author, "", 0, messageParams.messageCreatedAt, new Date().toLocaleString()]);
        await letterIterator(messageParams);
    } catch (error) {
        console.error("Error creating letters:", error);
    }
};

export const getAllLetterCountersController = async (): Promise<LetterModel[]> => {
    try {
        return await getAllLetterCounters();
    } catch (error) {
        console.error("Error fetching all letters:", error);
        return [];
    }
};

export const getAllLetterCountersAuthorsController = async (): Promise<{ author: string }[]> => {
    try {
        return await getAllLetterCountersAuthors();
    } catch (error) {
        console.error("Error fetching all authors:", error);
        return [];
    }
}

const checkAuthorExistense = async (params: SqlParams): Promise<{ author: string } | undefined> => {
    try {
        return await getFirstLetterCounterAuthorByAuthor(params);
    } catch (error) {
        console.error("Error fetching first author:", error);
    }
};

const letterIterator = async (messageParams: MessageModel): Promise<void> => {
    const validLetters = messageParams.content
        .toLowerCase()
        .split("")
        .filter((char) => /^[a-záéíóöőúüű]$/i.test(char));
    for (let letter of validLetters) {
        await updateLetterCounter([messageParams.author, letter]);
    }
};
