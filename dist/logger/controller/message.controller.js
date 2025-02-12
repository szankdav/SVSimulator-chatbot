var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { getAllMessages, getTenMessages, getMessagesByAuthorId } from "../model/message.model.js";
import { MessagesError } from "../utils/customErrorClasses/messagesError.class.js";
import { getAllAuthors, getAuthorById } from "../model/author.model.js";
const messagesController = /* @__PURE__ */ __name(async (db, page) => {
  try {
    if (isNaN(page)) {
      const renderObject2 = { viewName: "error", options: { err: "Page not found!" } };
      return renderObject2;
    }
    const messagesPageNumber = Math.ceil((await getAllMessages(db)).length / 10);
    const messagesSlicedByTen = await getTenMessages(db, [page === 1 ? 0 : (page - 1) * 10]);
    const authors = await getAllAuthors(db);
    let error = "";
    if (page > messagesPageNumber) {
      error = "No messages to show... Are you sure you are at the right URL?";
    }
    ;
    let renderObject = {
      viewName: "messages",
      options: { messagesPageNumber, authors, messagesSlicedByTen, error }
    };
    return renderObject;
  } catch (error) {
    console.error("Error creating messages renderObject:", error);
    throw new MessagesError("Error fetching messages!", 500);
  }
}, "messagesController");
const messagesByAuthorsController = /* @__PURE__ */ __name(async (db, params) => {
  try {
    let author = await getAuthorById(db, params);
    let messages = await getMessagesByAuthorId(db, params);
    if (!author) {
      author = { id: 0, name: "-", createdAt: "-" };
      messages = [];
    }
    ;
    let renderObject = {
      viewName: "author",
      options: { author, messages }
    };
    return renderObject;
  } catch (error) {
    console.error("Error creating messages renderObject:", error);
    throw new MessagesError("Error fetching messages!", 500);
  }
}, "messagesByAuthorsController");
export {
  messagesByAuthorsController,
  messagesController
};
