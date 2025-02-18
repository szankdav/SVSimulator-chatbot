import { Database } from "sqlite3";
import { execute, fetchAll } from "../database/database.js";
import { SqlParams } from "../types/sqlparams.type.js";
import { logger } from "../../winston/winston.js";

export type MessageModel = {
    id: number;
    authorId: number;
    content: string;
    messageCreatedAt: string;
};

export const createMessage = async (db: Database, params: SqlParams): Promise<void> => {
    const sql: string = `INSERT INTO Messages(authorId, message, createdAt) VALUES (?, ?, ?)`;
    try {
        await execute(db, sql, params);
    } catch (error) {
        logger.error("Error creating message:", error);
        throw new Error("Error creating message");
    }
};

export const getAllMessages = async (db: Database): Promise<MessageModel[]> => {
    const sql = `SELECT * FROM Messages`;
    try {
        const rows = await fetchAll<{ id: number; authorId: number; message: string; createdAt: string }>(db, sql);

        return rows.map((row) => ({
            id: row.id,
            authorId: row.authorId,
            content: row.message,
            messageCreatedAt: row.createdAt,
        }));
    } catch (error) {
        logger.error("Error fetching all messages:", error);
        throw new Error("Error fetching all messages");
    }
};

export const getMessagesByAuthorId = async (db: Database, params: SqlParams): Promise<MessageModel[]> => {
    const sql = `SELECT * FROM Messages WHERE authorId = ?`;
    try {
        const rows = await fetchAll<{ id: number; authorId: number; message: string; createdAt: string }>(db, sql, params);

        return rows.map((row) => ({
            id: row.id,
            authorId: row.authorId,
            content: row.message,
            messageCreatedAt: row.createdAt,
        }));
    } catch (error) {
        logger.error("Error fetching messages by author id:", error);
        throw new Error("Error fetching messages by author id");
    }
};

export const getTenMessages = async (db: Database, params: SqlParams): Promise<MessageModel[]> => {
    const sql = `SELECT * FROM Messages LIMIT 10 OFFSET ?`;
    try {
        const rows = await fetchAll<({ id: number; authorId: number; message: string; createdAt: string })>(db, sql, params);

        return rows.map((row) => ({
            id: row.id,
            authorId: row.authorId,
            content: row.message,
            messageCreatedAt: row.createdAt,
        }))
    } catch (error) {
        logger.error("Error fetching ten messages:", error);
        throw new Error("Error fetching ten messages");
    }
}
