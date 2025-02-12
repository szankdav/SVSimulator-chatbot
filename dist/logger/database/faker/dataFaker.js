var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { fakerHU } from "@faker-js/faker";
import { execute, fetchAll } from "../database.js";
const createFakeAuthors = /* @__PURE__ */ __name(() => {
  const fakeAuthors = [];
  for (let i = 0; i < 100; i++) {
    const name = fakerHU.person.fullName();
    const createdAt = fakerHU.date.past().toISOString();
    fakeAuthors.push(`('${name}', '${createdAt}')`);
  }
  return fakeAuthors;
}, "createFakeAuthors");
const insertAuthors = /* @__PURE__ */ __name(async (db, fakeAuthors) => {
  await execute(db, `INSERT INTO Authors (name, createdAt) VALUES ${fakeAuthors.join(", ")}`);
}, "insertAuthors");
const fetchAuthors = /* @__PURE__ */ __name(async (db) => {
  return await fetchAll(db, `SELECT id, createdAt FROM Authors`);
}, "fetchAuthors");
const insertLetters = /* @__PURE__ */ __name(async (db, authors) => {
  const alphabet = ["a", "\xE1", "b", "c", "d", "e", "\xE9", "f", "g", "h", "i", "\xED", "j", "k", "l", "m", "n", "o", "\xF3", "\xF6", "\u0151", "p", "q", "r", "s", "t", "u", "\xFA", "\xFC", "\u0171", "v", "w", "x", "y", "z"];
  const lettersData = [];
  authors.forEach(({ id, createdAt }) => {
    alphabet.forEach((letter) => {
      lettersData.push(`(${id}, '${letter}', '${createdAt}', '${createdAt}', 0)`);
    });
  });
  if (lettersData.length) {
    await execute(db, `INSERT INTO Letters (authorId, letter, createdAt, updatedAt, count) VALUES ${lettersData.join(", ")}`);
  }
}, "insertLetters");
const insertMessages = /* @__PURE__ */ __name(async (db, authors, letterCountMap) => {
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
    await execute(db, `INSERT INTO Messages (authorId, message, createdAt) VALUES ${fakeMessages.join(", ")}`);
  }
}, "insertMessages");
const updateLetterCounters = /* @__PURE__ */ __name(async (db, letterCountMap) => {
  const updateLetterCounters2 = [];
  letterCountMap.forEach((count, key) => {
    const [authorId, letter] = key.split("-");
    updateLetterCounters2.push(`UPDATE Letters SET count = count + ${count} WHERE authorId = ${authorId} AND letter = '${letter}';`);
  });
  if (updateLetterCounters2.length) {
    await execute(db, updateLetterCounters2.join(" "));
  }
}, "updateLetterCounters");
const fillDatabaseWithFakeData = /* @__PURE__ */ __name(async (db) => {
  try {
    const fakeAuthors = createFakeAuthors();
    await insertAuthors(db, fakeAuthors);
    const authors = await fetchAuthors(db);
    await insertLetters(db, authors);
    const letterCountMap = /* @__PURE__ */ new Map();
    await insertMessages(db, authors, letterCountMap);
    await updateLetterCounters(db, letterCountMap);
  } catch (error) {
    console.error(error);
  }
}, "fillDatabaseWithFakeData");
export {
  fillDatabaseWithFakeData
};
