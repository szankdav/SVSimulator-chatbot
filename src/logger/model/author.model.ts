import { Database } from "sqlite3";
import { execute, fetchAll, fetchFirst } from "../database/database.js";
import { SqlParams } from "../types/sqlparams.type.js";

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
        console.error("Error creating author:", error);
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
        console.error("Error fetching all authors:", error);
        throw new Error("Error fetching all authors");
    }
};

export const getAuthorByName = async (db: Database, params: SqlParams): Promise<AuthorModel | undefined> => {
    const sql = `SELECT * FROM Authors WHERE name = ?`;
    try {
        return await fetchFirst<{ id: number; name: string; createdAt: string }>(db, sql, params);
    } catch (error) {
        console.error("Error fetching author:", error);
        throw new Error("Error fetching author");
    }
}

export const getAuthorById = async (db: Database, params: SqlParams): Promise<AuthorModel | undefined> => {
    const sql = `SELECT * FROM Authors WHERE id = ?`;
    try {
        return await fetchFirst<{ id: number; name: string; createdAt: string }>(db, sql, params);
    } catch (error) {
        console.error("Error fetching author:", error);
        throw new Error("Error fetching author");
    }
}
