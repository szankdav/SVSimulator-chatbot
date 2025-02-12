var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { execute, fetchAll, fetchFirst } from "../database/database.js";
const updateLetterCounter = /* @__PURE__ */ __name(async (db, params) => {
  const sql = `UPDATE Letters SET count = count + 1, updatedAt = ? WHERE authorId = ? AND letter = ?`;
  try {
    await execute(db, sql, params);
  } catch (error) {
    console.error("Error updating letter count:", error);
    throw new Error("Error updating letter count");
  }
}, "updateLetterCounter");
const getLetterCounterByAuthorId = /* @__PURE__ */ __name(async (db, params) => {
  const sql = `SELECT authorId FROM Letters WHERE authorId = ?`;
  try {
    return await fetchFirst(db, sql, params);
  } catch (error) {
    console.error("Error fetching authorId:", error);
    throw new Error("Error fetching authorId");
  }
}, "getLetterCounterByAuthorId");
const getAllLetterCounters = /* @__PURE__ */ __name(async (db) => {
  const sql = `SELECT * FROM Letters`;
  try {
    const rows = await fetchAll(db, sql);
    return rows.map((row) => ({
      id: row.id,
      authorId: row.authorId,
      letter: row.letter,
      count: row.count,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }));
  } catch (error) {
    console.error("Error fetching all letters:", error);
    throw new Error("Error fetching all letters");
  }
}, "getAllLetterCounters");
const getAllLetterCountersAuthors = /* @__PURE__ */ __name(async (db) => {
  const sql = `SELECT authorId FROM Letters GROUP BY authorId`;
  try {
    return await fetchAll(db, sql);
  } catch (error) {
    console.error("Error fetching all authors:", error);
    throw new Error("Error fetching all authors");
  }
}, "getAllLetterCountersAuthors");
const getLetterCountersByAuthorId = /* @__PURE__ */ __name(async (db, params) => {
  const sql = `SELECT * FROM Letters WHERE authorId = ?`;
  try {
    const rows = await fetchAll(db, sql, params);
    return rows.map((row) => ({
      id: row.id,
      authorId: row.authorId,
      letter: row.letter,
      count: row.count,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }));
  } catch (error) {
    console.error("Error fetching letter counters:", error);
    throw new Error("Error fetching letter counters");
  }
}, "getLetterCountersByAuthorId");
const createLetterCounters = /* @__PURE__ */ __name(async (db, params) => {
  const alphabet = [
    "a",
    "\xE1",
    "b",
    "c",
    "d",
    "e",
    "\xE9",
    "f",
    "g",
    "h",
    "i",
    "\xED",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "\xF3",
    "\xF6",
    "\u0151",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "\xFA",
    "\xFC",
    "\u0171",
    "v",
    "w",
    "x",
    "y",
    "z"
  ];
  const sql = `INSERT INTO Letters (authorId, letter, count, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)`;
  try {
    return new Promise(async (resolve, reject) => {
      alphabet.forEach((letter) => {
        params[1] = letter;
        db.serialize(async () => {
          await execute(db, sql, params);
          resolve();
        });
      });
    });
  } catch (error) {
    console.error("Error creating letters:", error);
    throw new Error("Error creating letters");
  }
}, "createLetterCounters");
export {
  createLetterCounters,
  getAllLetterCounters,
  getAllLetterCountersAuthors,
  getLetterCounterByAuthorId,
  getLetterCountersByAuthorId,
  updateLetterCounter
};
