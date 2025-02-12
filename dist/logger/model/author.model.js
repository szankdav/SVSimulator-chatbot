var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { execute, fetchAll, fetchFirst } from "../database/database.js";
const createAuthor = /* @__PURE__ */ __name(async (db, params) => {
  const sql = `INSERT INTO Authors(name, createdAt) VALUES (?, ?)`;
  try {
    await execute(db, sql, params);
  } catch (error) {
    console.error("Error creating author:", error);
    throw new Error("Error creating author");
  }
}, "createAuthor");
const getAllAuthors = /* @__PURE__ */ __name(async (db) => {
  const sql = `SELECT * FROM Authors`;
  try {
    const rows = await fetchAll(db, sql);
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      createdAt: row.createdAt
    }));
  } catch (error) {
    console.error("Error fetching all authors:", error);
    throw new Error("Error fetching all authors");
  }
}, "getAllAuthors");
const getAuthorByName = /* @__PURE__ */ __name(async (db, params) => {
  const sql = `SELECT * FROM Authors WHERE name = ?`;
  try {
    return await fetchFirst(db, sql, params);
  } catch (error) {
    console.error("Error fetching author:", error);
    throw new Error("Error fetching author");
  }
}, "getAuthorByName");
const getAuthorById = /* @__PURE__ */ __name(async (db, params) => {
  const sql = `SELECT * FROM Authors WHERE id = ?`;
  try {
    return await fetchFirst(db, sql, params);
  } catch (error) {
    console.error("Error fetching author:", error);
    throw new Error("Error fetching author");
  }
}, "getAuthorById");
const getTenAuthors = /* @__PURE__ */ __name(async (db, params) => {
  const sql = `SELECT * FROM Authors LIMIT 10 OFFSET ?`;
  try {
    const rows = await fetchAll(db, sql, params);
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      createdAt: row.createdAt
    }));
  } catch (error) {
    console.error("Error fetching ten authors:", error);
    throw new Error("Error fetching ten authors");
  }
}, "getTenAuthors");
export {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  getAuthorByName,
  getTenAuthors
};
