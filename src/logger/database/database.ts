import sqlite3, { Database } from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { createMessagesTable, createLettersTable } from "./tables";
import { SqlParams } from "../types/sqlparams.type";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFilePath = path.join(__dirname, "DiscordMessages.db");

export const db = new sqlite3.Database(dbFilePath);

export const execute = async (db: sqlite3.Database, sql: string, params: SqlParams = []): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (params && params.length > 0) {
            db.run(sql, params, (err) => {
                if (err) { reject(err); return; };
                resolve();
            });
        }
        else {
            db.exec(sql, (err) => {
                if (err) { reject(err); return; };
                resolve();
            });
        }
    });
}

export const fetchAll = async <T>(db: sqlite3.Database, sql: string, params: SqlParams = []): Promise<T[]> => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) { reject(err); return; }
            resolve(rows as T[]);
        });
    });
};

export const fetchFirst = async <T>(db: sqlite3.Database, sql: string, params: SqlParams = []): Promise<T | undefined> => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) { reject(err); return; };
            resolve(row as T | undefined);
        });
    });
};

export const createTables = async (): Promise<void> => {
    try {
        await createMessagesTable(db);
        await createLettersTable(db);
    } catch (error) {
        console.error("Error creating tables:", error);
    }
};