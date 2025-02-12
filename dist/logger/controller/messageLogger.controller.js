var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { createAuthor, getAuthorByName } from "../model/author.model.js";
import { createMessage } from "../model/message.model.js";
import { DatabaseError } from "../utils/customErrorClasses/databaseError.class.js";
import { createLetterCounters, getLetterCounterByAuthorId, updateLetterCounter } from "../model/letterCounter.model.js";
import { LetterCounterError } from "../utils/customErrorClasses/letterCounterError.class.js";
import { AuthorsError } from "../utils/customErrorClasses/authorsError.class.js";
const messageLoggerController = /* @__PURE__ */ __name(async (db, message) => {
  try {
    const messageCreatedAt = new Date(message.messageCreatedAt);
    const authorToCreate = [message.username, messageCreatedAt.toLocaleString()];
    const existingAuthor = await getAuthorByName(db, [message.username]);
    if (!existingAuthor) {
      await createAuthor(db, authorToCreate);
      console.log("Author added to the database!");
    }
    const newAuthorId = await getAuthorByName(db, [message.username]);
    const messageToCreate = {
      id: 0,
      authorId: newAuthorId.id,
      content: message.content,
      messageCreatedAt: messageCreatedAt.toLocaleString()
    };
    await createMessage(db, [messageToCreate.authorId, messageToCreate.content, messageToCreate.messageCreatedAt]);
    await createLetterCountersInDatabase(db, messageToCreate);
  } catch (error) {
    console.error("Error logging message:", error);
    throw new DatabaseError("Error logging message", 500);
  }
}, "messageLoggerController");
const createLetterCountersInDatabase = /* @__PURE__ */ __name(async (db, messageParams) => {
  try {
    const existingAuthorId = await checkAuthorIdExistense(db, [messageParams.authorId]);
    if (!existingAuthorId)
      await createLetterCounters(db, [messageParams.authorId, "", 0, messageParams.messageCreatedAt, (/* @__PURE__ */ new Date()).toLocaleString()]);
    await letterIterator(db, messageParams);
  } catch (error) {
    console.error("Error creating letters:", error);
    throw new LetterCounterError("Error creating letters", 500);
  }
}, "createLetterCountersInDatabase");
const checkAuthorIdExistense = /* @__PURE__ */ __name(async (db, params) => {
  try {
    return await getLetterCounterByAuthorId(db, params);
  } catch (error) {
    console.error("Error fetching first author:", error);
    throw new AuthorsError("Error fetching first author", 500);
  }
}, "checkAuthorIdExistense");
const letterIterator = /* @__PURE__ */ __name(async (db, messageParams) => {
  const validLetters = messageParams.content.toLowerCase().split("").filter((char) => /^[a-záéíóöőúüű]$/i.test(char));
  for (let letter of validLetters) {
    const updatedAt = /* @__PURE__ */ new Date();
    await updateLetterCounter(db, [updatedAt.toLocaleString(), messageParams.authorId, letter]);
  }
}, "letterIterator");
export {
  checkAuthorIdExistense,
  createLetterCountersInDatabase,
  letterIterator,
  messageLoggerController
};
