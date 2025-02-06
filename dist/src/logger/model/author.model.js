import { execute, fetchAll, fetchFirst } from "../database/database.js";
import { DatabaseError } from "../middleware/databaseError.handler.js";
export const createAuthor = async (db, params) => {
    const sql = `INSERT INTO Authors(name, createdAt) VALUES (?, ?)`;
    try {
        await execute(db, sql, params);
    }
    catch (error) {
        console.error("Error creating author:", error);
        throw new Error("Error creating author");
    }
};
export const getAllAuthors = async (db) => {
    const sql = `SELECT * FROM Authors`;
    try {
        const rows = await fetchAll(db, sql);
        return rows.map((row) => ({
            id: row.id,
            name: row.name,
            createdAt: row.createdAt,
        }));
    }
    catch (error) {
        console.error("Error fetching all authors:", error);
        throw new Error("Error fetching all authors");
    }
};
export const getAuthorByName = async (db, params) => {
    const sql = `SELECT * FROM Authors WHERE name = ?`;
    try {
        return await fetchFirst(db, sql, params);
    }
    catch (error) {
        console.error("Error fetching author:", error);
        throw new Error("Error fetching author");
    }
};
export const getAuthorById = async (db, params) => {
    const sql = `SELECT * FROM Authors WHERE id = ?`;
    try {
        const author = await fetchFirst(db, sql, params);
        if (!author) {
            throw new DatabaseError("There is no author with the given id in the database!", 404);
        }
        return author;
    }
    catch (error) {
        console.error("Error fetching author:", error);
        throw new Error("Error fetching author");
    }
};
export const getTenAuthors = async (db, params) => {
    const sql = `SELECT * FROM Authors LIMIT 10 OFFSET ?`;
    try {
        const rows = await fetchAll(db, sql, params);
        return rows.map((row) => ({
            id: row.id,
            name: row.name,
            createdAt: row.createdAt,
        }));
    }
    catch (error) {
        console.error("Error fetching ten authors:", error);
        throw new Error("Error fetching ten authors");
    }
};
