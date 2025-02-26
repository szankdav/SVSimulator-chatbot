var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { execute } from "./database.js";
import { logger } from "../../winston/winston.js";
const createAuthorsTable = /* @__PURE__ */ __name(async (db) => {
  try {
    await execute(
      db,
      `CREATE TABLE IF NOT EXISTS Authors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            createdAt TEXT NOT NULL)`
    );
  } catch (error) {
    logger.error("Error creating Authors table:", error);
  }
}, "createAuthorsTable");
const createMessagesTable = /* @__PURE__ */ __name(async (db) => {
  try {
    await execute(
      db,
      `CREATE TABLE IF NOT EXISTS Messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            authorId INTEGER NOT NULL,
            message TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            FOREIGN KEY (authorId) REFERENCES Authors(id) ON DELETE CASCADE)`
    );
  } catch (error) {
    logger.error("Error creating Messages table:", error);
  }
}, "createMessagesTable");
const createLettersTable = /* @__PURE__ */ __name(async (db) => {
  try {
    await execute(
      db,
      `CREATE TABLE IF NOT EXISTS Letters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        authorId INTEGER NOT NULL,
        letter TEXT NOT NULL,
        count INT DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (authorId) REFERENCES Authors(id) ON DELETE CASCADE)`
    );
  } catch (error) {
    logger.error("Error creating Letters table:", error);
  }
}, "createLettersTable");
const createTables = /* @__PURE__ */ __name(async (db) => {
  try {
    await execute(db, "PRAGMA foreign_keys = ON;");
    await createAuthorsTable(db);
    await createMessagesTable(db);
    await createLettersTable(db);
  } catch (error) {
    logger.error("Error creating tables:", error);
  }
}, "createTables");
export {
  createAuthorsTable,
  createLettersTable,
  createMessagesTable,
  createTables
};
