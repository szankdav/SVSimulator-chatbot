import { Database } from "sqlite3";
import { execute, fetchAll, fetchFirst } from "../database/database.js";
import { SqlParams } from "../types/sqlparams.type.js";
import { logger } from "../../winston/winston.js";

export type AuthorModel = {
    id: number;
    name: string;
    createdAt: string;
};

export const createAuthor = async (db: Database, params: SqlParams): Promise<void> => {
    const sql: string = `INSERT INTO Authors(name, createdAt) VALUES (?, ?)`;
    try {
        await execute(db, sql, params);
    } catch (error) {
        logger.error("Error creating author:", error);
        throw new Error("Error creating author");
    }
};

export const getAllAuthors = async (db: Database): Promise<AuthorModel[]> => {
    const sql = `SELECT * FROM Authors`;
    try {
        const rows = await fetchAll<{ id: number; name: string; createdAt: string }>(db, sql);

        return rows.map((row) => ({
            id: row.id,
            name: row.name,
            createdAt: row.createdAt,
        }));
    } catch (error) {
        logger.error("Error fetching all authors:", error);
        throw new Error("Error fetching all authors");
    }
};

export const getAuthorByName = async (db: Database, params: SqlParams): Promise<AuthorModel | undefined> => {
    const sql = `SELECT * FROM Authors WHERE name = ?`;
    try {
        return await fetchFirst<{ id: number; name: string; createdAt: string }>(db, sql, params);
    } catch (error) {
        logger.error("Error fetching author:", error);
        throw new Error("Error fetching author");
    }
}

export const getAuthorById = async(db: Database, params: SqlParams): Promise<AuthorModel | undefined> => {
    const sql = `SELECT * FROM Authors WHERE id = ?`;
    try {
        return await fetchFirst<{ id: number; name: string; createdAt: string }>(db, sql, params);
    } catch (error) {
        logger.error("Error fetching author:", error);
        throw new Error("Error fetching author");
    }
}

export const getTenAuthors = async (db: Database, params: SqlParams): Promise<AuthorModel[]> => {
    const sql = `SELECT * FROM Authors LIMIT 10 OFFSET ?`;
    try {
        const rows = await fetchAll<({ id: number; name: string; createdAt: string })>(db, sql, params);

        return rows.map((row) => ({
            id: row.id,
            name: row.name,
            createdAt: row.createdAt,
        }))
    } catch (error) {
        logger.error("Error fetching ten authors:", error);
        throw new Error("Error fetching ten authors");
    }
}

export const deleteAllAuthors = async (db: Database): Promise<void> => {
    await execute(db, "PRAGMA foreign_keys = ON;");
    const sql = `DELETE FROM Authors`;
    try {
        const rows = await execute(db, sql);
        logger.info("Database ereased.");
    } catch (error) {
        logger.error("Error deleting authors:", error);
        throw new Error("Error deleting authors");
    }
}