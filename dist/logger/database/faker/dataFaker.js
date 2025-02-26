var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { fakerHU } from "@faker-js/faker";
import { execute, fetchAll } from "../database.js";
import { db } from "../database.js";
import { logger } from "../../../winston/winston.js";
const createFakeAuthors = /* @__PURE__ */ __name(() => {
  const fakeAuthors = [];
  for (let i = 0; i < 100; i++) {
    const name = fakerHU.person.fullName();
    const createdAt = fakerHU.date.past().toISOString();
    fakeAuthors.push(`('${name}', '${createdAt}')`);
  }
  return fakeAuthors;
}, "createFakeAuthors");
const insertAuthors = /* @__PURE__ */ __name(async (db2, fakeAuthors) => {
  await execute(db2, `INSERT INTO Authors (name, createdAt) VALUES ${fakeAuthors.join(", ")}`);
}, "insertAuthors");
const fetchAuthors = /* @__PURE__ */ __name(async (db2) => {
  return await fetchAll(db2, `SELECT id, createdAt FROM Authors`);
}, "fetchAuthors");
const insertLetters = /* @__PURE__ */ __name(async (db2, authors) => {
  const alphabet = ["a", "\xE1", "b", "c", "d", "e", "\xE9", "f", "g", "h", "i", "\xED", "j", "k", "l", "m", "n", "o", "\xF3", "\xF6", "\u0151", "p", "q", "r", "s", "t", "u", "\xFA", "\xFC", "\u0171", "v", "w", "x", "y", "z"];
  const lettersData = [];
  authors.forEach(({ id, createdAt }) => {
    alphabet.forEach((letter) => {
      lettersData.push(`(${id}, '${letter}', '${createdAt}', '${createdAt}', 0)`);
    });
  });
  if (lettersData.length) {
    await execute(db2, `INSERT INTO Letters (authorId, letter, createdAt, updatedAt, count) VALUES ${lettersData.join(", ")}`);
  }
}, "insertLetters");
const insertMessages = /* @__PURE__ */ __name(async (db2, authors, letterCountMap) => {
  const fakeMessages = [];
  for (const author of authors) {
    const randomMessageNumber = Math.floor(Math.random() * (20 - 1 + 1) + 1);
    for (let i = 0; i < randomMessageNumber; i++) {
      const content = fakerHU.string.fromCharacters("a\xE1bcde\xE9fghi\xEDjklmno\xF3\xF6\u0151pqrstu\xFA\xFC\u0171vwxyz", { min: 4, max: 100 });
      const messageCreatedAt = fakerHU.date.past().toISOString();
      fakeMessages.push(`(${author.id}, '${content}', '${messageCreatedAt}')`);
      for (const letter of content) {
        const key = `${author.id}-${letter}`;
        letterCountMap.set(key, (letterCountMap.get(key) || 0) + 1);
      }
    }
  }
  if (fakeMessages.length) {
    await execute(db2, `INSERT INTO Messages (authorId, message, createdAt) VALUES ${fakeMessages.join(", ")}`);
  }
}, "insertMessages");
const updateLetterCounters = /* @__PURE__ */ __name(async (db2, letterCountMap) => {
  const updateLetterCounters2 = [];
  letterCountMap.forEach((count, key) => {
    const [authorId, letter] = key.split("-");
    updateLetterCounters2.push(`UPDATE Letters SET count = count + ${count} WHERE authorId = ${authorId} AND letter = '${letter}';`);
  });
  if (updateLetterCounters2.length) {
    await execute(db2, updateLetterCounters2.join(" "));
  }
}, "updateLetterCounters");
const fillDatabaseWithFakeData = /* @__PURE__ */ __name(async (db2) => {
  try {
    const fakeAuthors = createFakeAuthors();
    await insertAuthors(db2, fakeAuthors);
    const authors = await fetchAuthors(db2);
    await insertLetters(db2, authors);
    const letterCountMap = /* @__PURE__ */ new Map();
    await insertMessages(db2, authors, letterCountMap);
    await updateLetterCounters(db2, letterCountMap);
  } catch (error) {
    logger.error(error);
  }
}, "fillDatabaseWithFakeData");
const runFaker = /* @__PURE__ */ __name(async () => {
  logger.info("Database filled with fake data.");
  await fillDatabaseWithFakeData(db);
}, "runFaker");
export {
  runFaker
};
