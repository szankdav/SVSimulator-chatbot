var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { execute, fetchAll } from "../database/database.js";
import { logger } from "../../winston/winston.js";
const createMessage = /* @__PURE__ */ __name(async (db, params) => {
  const sql = `INSERT INTO Messages(authorId, message, createdAt) VALUES (?, ?, ?)`;
  try {
    await execute(db, sql, params);
  } catch (error) {
    logger.error("Error creating message:", error);
    throw new Error("Error creating message");
  }
}, "createMessage");
const getAllMessages = /* @__PURE__ */ __name(async (db) => {
  const sql = `SELECT * FROM Messages`;
  try {
    const rows = await fetchAll(db, sql);
    return rows.map((row) => ({
      id: row.id,
      authorId: row.authorId,
      content: row.message,
      messageCreatedAt: row.createdAt
    }));
  } catch (error) {
    logger.error("Error fetching all messages:", error);
    throw new Error("Error fetching all messages");
  }
}, "getAllMessages");
const getMessagesByAuthorId = /* @__PURE__ */ __name(async (db, params) => {
  const sql = `SELECT * FROM Messages WHERE authorId = ?`;
  try {
    const rows = await fetchAll(db, sql, params);
    return rows.map((row) => ({
      id: row.id,
      authorId: row.authorId,
      content: row.message,
      messageCreatedAt: row.createdAt
    }));
  } catch (error) {
    logger.error("Error fetching messages by author id:", error);
    throw new Error("Error fetching messages by author id");
  }
}, "getMessagesByAuthorId");
const getTenMessages = /* @__PURE__ */ __name(async (db, params) => {
  const sql = `SELECT * FROM Messages LIMIT 10 OFFSET ?`;
  try {
    const rows = await fetchAll(db, sql, params);
    return rows.map((row) => ({
      id: row.id,
      authorId: row.authorId,
      content: row.message,
      messageCreatedAt: row.createdAt
    }));
  } catch (error) {
    logger.error("Error fetching ten messages:", error);
    throw new Error("Error fetching ten messages");
  }
}, "getTenMessages");
export {
  createMessage,
  getAllMessages,
  getMessagesByAuthorId,
  getTenMessages
};
