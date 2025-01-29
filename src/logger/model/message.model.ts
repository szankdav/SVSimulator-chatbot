import { Database } from "sqlite3";
import { execute, fetchAll } from "../database/database.js";
import { SqlParams } from "../types/sqlparams.type.js";

export type MessageModel = {
    id: number;
    author: string;
    content: string;
    messageCreatedAt: string;
};

export const createMessage = async (db: Database, params: SqlParams): Promise<void> => {
    const sql: string = `INSERT INTO Messages(author, message, createdAt) VALUES (?, ?, ?)`;
    try {
        await execute(db, sql, params);
    } catch (error) {
        console.error("Error creating message:", error);
        throw new Error("Error creating message");
    }
};

export const getAllMessages = async (db: Database): Promise<MessageModel[]> => {
    const sql = `SELECT * FROM Messages`;
    try {
        const rows = await fetchAll<{ id: number; author: string; message: string; createdAt: string }>(db, sql);

        return rows.map((row) => ({
            id: row.id,
            author: row.author,
            content: row.message,
            messageCreatedAt: row.createdAt,
        }));
    } catch (error) {
        console.error("Error fetching all messages:", error);
        throw new Error("Error fetching all messages");
    }
};
