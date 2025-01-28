import { db, execute, fetchAll, fetchFirst } from "../database/database.js";
import { paramaterValidator, SqlParams } from "../types/sqlparams.type.js";

export type LetterModel = {
    id: number;
    author: string;
    letter: string;
    count: number;
    createdAt: Date;
    updatedAt: Date;
}

export const updateLetterCounter = async (params: SqlParams): Promise<void> => {
    const sql = `UPDATE Letters SET count = count + 1 WHERE author = ? AND letter = ?`;
    try {
        await execute(db, sql, params);
    } catch (error) {
        console.error("Error updating letter count:", error);
    }
};

export const getFirstLetterCounterAuthorByAuthor = async (params: SqlParams): Promise<{ author: string } | undefined> => {
    const sql = `SELECT author FROM Letters WHERE author = ?`;
    try {
        return await fetchFirst<{ author: string }>(db, sql, params);
    } catch (error) {
        console.error("Error fetching first author:", error);
    }
};

export const getAllLetterCounters = async (): Promise<LetterModel[]> => {
    const sql = `SELECT * FROM Letters`;
    try {
        const rows = await fetchAll<{
            id: number;
            author: string;
            letter: string;
            count: number;
            createdAt: string;
            updatedAt: string;
        }>(db, sql);

        return rows.map((row) => ({
            id: row.id,
            author: row.author,
            letter: row.letter,
            count: row.count,
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt),
        }));
    } catch (error) {
        console.error("Error fetching all letters:", error);
        return [];
    }
};

export const getAllLetterCountersAuthors = async (): Promise<{ author: string }[]> => {
    const sql = `SELECT author FROM Letters GROUP BY author`;
    try {
        return await fetchAll<{ author: string }>(db, sql);
    } catch (error) {
        console.error("Error fetching all authors:", error);
        return [];
    }
};

export const createLetterCounters = async (params: SqlParams): Promise<void> => {
    const alphabet: string[] = [
        "a",
        "á",
        "b",
        "c",
        "d",
        "e",
        "é",
        "f",
        "g",
        "h",
        "i",
        "í",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "ó",
        "ö",
        "ő",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "ú",
        "ü",
        "ű",
        "v",
        "w",
        "x",
        "y",
        "z",
    ];

    const sql: string = `INSERT INTO Letters (author, letter, count, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)`;

    try {
        return new Promise(async (resolve, reject) => {
            alphabet.forEach((letter: string) => {
                params[1] = letter;
                db.serialize(async (): Promise<void> => {
                    await execute(db, sql, params);
                    resolve();
                });
            });
        });
    } catch (error) {
        console.error("Error inserting letters:", error);
    }
};

