import { Database } from "sqlite3";
import { execute } from "./database";

export const createMessagesTable = async (db: Database): Promise<void> => {
    try {
        await execute(
            db,
            `CREATE TABLE IF NOT EXISTS Messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            author TEXT NOT NULL,
            message TEXT NOT NULL,
            createdAt DATE NOT NULL)`
        );
    } catch (error) {
        console.error("Error creating Messages table:", error);
    }
};

export const createLettersTable = async (db: Database): Promise<void> => {
    try {
        await execute(
            db,
            `CREATE TABLE IF NOT EXISTS Letters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        author TEXT NOT NULL,
        letter TEXT NOT NULL,
        count INT DEFAULT 0,
        createdAt DATE NOT NULL,
        updatedAt DATE NOT NULL)`
        );
    } catch (error) {
        console.error("Error creating Letters table:", error);
    }
};

export const createTables = async (db: Database): Promise<void> => {
    try {
        await createMessagesTable(db);
        await createLettersTable(db);
    } catch (error) {
        console.error("Error creating tables:", error);
    }
};