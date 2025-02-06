import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFilePath = path.join(__dirname, "DiscordMessages.db");
export const db = new sqlite3.Database(dbFilePath);
export const execute = async (db, sql, params = []) => {
    return new Promise((resolve, reject) => {
        if (params && params.length > 0) {
            db.run(sql, params, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                ;
                resolve();
            });
        }
        else {
            db.exec(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                ;
                resolve();
            });
        }
    });
};
export const fetchAll = async (db, sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};
export const fetchFirst = async (db, sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            ;
            resolve(row);
        });
    });
};
