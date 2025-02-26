var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "../../winston/winston.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFilePath = path.join(__dirname, "DiscordMessages.db");
logger.info(`Using SQLite database at: ${dbFilePath}`);
const db = new sqlite3.Database(dbFilePath, (err) => {
  if (err) {
    logger.error("Failed to connect to database:", err);
  } else {
    logger.info("Connected to SQLite database successfully.");
  }
});
const execute = /* @__PURE__ */ __name(async (db2, sql, params = []) => {
  return new Promise((resolve, reject) => {
    if (params && params.length > 0) {
      db2.run(sql, params, (err) => {
        if (err) {
          reject(err);
          return;
        }
        ;
        resolve();
      });
    } else {
      db2.exec(sql, (err) => {
        if (err) {
          reject(err);
          return;
        }
        ;
        resolve();
      });
    }
  });
}, "execute");
const fetchAll = /* @__PURE__ */ __name(async (db2, sql, params = []) => {
  return new Promise((resolve, reject) => {
    db2.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}, "fetchAll");
const fetchFirst = /* @__PURE__ */ __name(async (db2, sql, params = []) => {
  return new Promise((resolve, reject) => {
    db2.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      ;
      resolve(row);
    });
  });
}, "fetchFirst");
export {
  db,
  execute,
  fetchAll,
  fetchFirst
};
