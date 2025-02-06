import { execute, fetchAll } from "../database/database.js";
export const createMessage = async (db, params) => {
    const sql = `INSERT INTO Messages(authorId, message, createdAt) VALUES (?, ?, ?)`;
    try {
        await execute(db, sql, params);
    }
    catch (error) {
        console.error("Error creating message:", error);
        throw new Error("Error creating message");
    }
};
export const getAllMessages = async (db) => {
    const sql = `SELECT * FROM Messages`;
    try {
        const rows = await fetchAll(db, sql);
        return rows.map((row) => ({
            id: row.id,
            authorId: row.authorId,
            content: row.message,
            messageCreatedAt: row.createdAt,
        }));
    }
    catch (error) {
        console.error("Error fetching all messages:", error);
        throw new Error("Error fetching all messages");
    }
};
export const getMessagesByAuthorId = async (db, params) => {
    const sql = `SELECT * FROM Messages WHERE authorId = ?`;
    try {
        const rows = await fetchAll(db, sql, params);
        return rows.map((row) => ({
            id: row.id,
            authorId: row.authorId,
            content: row.message,
            messageCreatedAt: row.createdAt,
        }));
    }
    catch (error) {
        console.error("Error fetching messages by author id:", error);
        throw new Error("Error fetching messages by author id");
    }
};
export const getTenMessages = async (db, params) => {
    const sql = `SELECT * FROM Messages LIMIT 10 OFFSET ?`;
    try {
        const rows = await fetchAll(db, sql, params);
        return rows.map((row) => ({
            id: row.id,
            authorId: row.authorId,
            content: row.message,
            messageCreatedAt: row.createdAt,
        }));
    }
    catch (error) {
        console.error("Error fetching ten messages:", error);
        throw new Error("Error fetching ten messages");
    }
};
