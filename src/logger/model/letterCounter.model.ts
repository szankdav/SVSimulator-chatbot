import { Database } from "sqlite3";
import { execute, fetchAll, fetchFirst } from "../database/database.js";
import { SqlParams } from "../types/sqlparams.type.js";

export type LetterModel = {
    id: number;
    authorId: number;
    letter: string;
    count: number;
    createdAt: Date;
    updatedAt: Date;
}

export const updateLetterCounter = async (db: Database, params: SqlParams): Promise<void> => {
    const sql = `UPDATE Letters SET count = count + 1 WHERE authorId = ? AND letter = ?`;
    try {
        await execute(db, sql, params);
    } catch (error) {
        console.error("Error updating letter count:", error);
        throw new Error("Error updating letter count");
    }
};

export const getLetterCounterByAuthorId = async (db: Database, params: SqlParams): Promise<{ authorId: number } | undefined> => {
    const sql = `SELECT authorId FROM Letters WHERE authorId = ?`;
    try {
        return await fetchFirst<{ authorId: number }>(db, sql, params);
    } catch (error) {
        console.error("Error fetching authorId:", error);
        throw new Error("Error fetching authorId");
    }
};

export const getAllLetterCounters = async (db: Database): Promise<LetterModel[]> => {
    const sql = `SELECT * FROM Letters`;
    try {
        const rows = await fetchAll<{
            id: number;
            authorId: number;
            letter: string;
            count: number;
            createdAt: string;
            updatedAt: string;
        }>(db, sql);

        return rows.map((row) => ({
            id: row.id,
            authorId: row.authorId,
            letter: row.letter,
            count: row.count,
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt),
        }));
    } catch (error) {
        console.error("Error fetching all letters:", error);
        throw new Error("Error fetching all letters");
    }
};

export const getAllLetterCountersAuthors = async (db: Database): Promise<{ author: string }[]> => {
    const sql = `SELECT author FROM Letters GROUP BY author`;
    try {
        return await fetchAll<{ author: string }>(db, sql);
    } catch (error) {
        console.error("Error fetching all authors:", error);
        throw new Error("Error fetching all authors");
    }
};

export const createLetterCounters = async (db: Database, params: SqlParams): Promise<void> => {
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

    const sql: string = `INSERT INTO Letters (authorId, letter, count, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)`;

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
        console.error("Error creating letters:", error);
        throw new Error("Error creating letters");
    }
};

