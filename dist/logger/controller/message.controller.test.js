import { beforeEach, vi, describe, it, expect, afterEach } from "vitest";
import * as authorModel from "../model/author.model";
import * as messageModel from "../model/message.model";
import { createTables } from "../database/tables";
import sqlite3 from "sqlite3";
import { MessagesError } from "../utils/customErrorClasses/messagesError.class";
import * as messagesController from "../controller/message.controller";
let db;
const createdAtTime = (/* @__PURE__ */ new Date()).toLocaleString();
describe("message.controller tests", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {
    });
    vi.spyOn(console, "log").mockImplementation(() => {
    });
    db = new sqlite3.Database(":memory:");
    await createTables(db);
    const testAuthor1 = { id: 1, name: "Teszt Elek", createdAt: createdAtTime };
    const testAuthor2 = { id: 2, name: "Teszt Elekn\xE9", createdAt: createdAtTime };
    await authorModel.createAuthor(db, [testAuthor1.name, testAuthor1.createdAt]);
    await authorModel.createAuthor(db, [testAuthor2.name, testAuthor2.createdAt]);
    const testMessage1 = { id: 1, authorId: 1, content: "Teszt", messageCreatedAt: createdAtTime };
    const testMessage2 = { id: 2, authorId: 2, content: "Teszt", messageCreatedAt: createdAtTime };
    const testMessage3 = { id: 3, authorId: 1, content: "Teszt", messageCreatedAt: createdAtTime };
    await messageModel.createMessage(db, [testMessage1.authorId, testMessage1.content, testMessage1.messageCreatedAt]);
    await messageModel.createMessage(db, [testMessage2.authorId, testMessage2.content, testMessage2.messageCreatedAt]);
    await messageModel.createMessage(db, [testMessage3.authorId, testMessage3.content, testMessage3.messageCreatedAt]);
  });
  afterEach(() => {
    db.close();
    vi.restoreAllMocks();
  });
  describe("messagesController tests", () => {
    it("should return with a valid renderObject if data is valid", async () => {
      vi.spyOn(messagesController, "messagesController");
      const renderObject = await messagesController.messagesController(db, 1);
      const testAuthor1 = { id: 1, name: "Teszt Elek", createdAt: createdAtTime };
      const testAuthor2 = { id: 2, name: "Teszt Elekn\xE9", createdAt: createdAtTime };
      const testMessage1 = { id: 1, authorId: 1, content: "Teszt", messageCreatedAt: createdAtTime };
      const testMessage2 = { id: 2, authorId: 2, content: "Teszt", messageCreatedAt: createdAtTime };
      const testMessage3 = { id: 3, authorId: 1, content: "Teszt", messageCreatedAt: createdAtTime };
      expect(renderObject.viewName).toBe("messages");
      const messagesPageNumber = 1;
      const messagesSlicedByTen = [testMessage1, testMessage2, testMessage3];
      const authors = [testAuthor1, testAuthor2];
      const error = "";
      expect(renderObject.options).toStrictEqual({ messagesPageNumber, authors, messagesSlicedByTen, error });
    });
    it("should return with a valid renderObject if data is not valid", async () => {
      vi.spyOn(messagesController, "messagesController");
      const testAuthor1 = { id: 1, name: "Teszt Elek", createdAt: createdAtTime };
      const testAuthor2 = { id: 2, name: "Teszt Elekn\xE9", createdAt: createdAtTime };
      const renderObject = await messagesController.messagesController(db, 10);
      expect(renderObject.viewName).toBe("messages");
      const messagesPageNumber = 1;
      const messagesSlicedByTen = [];
      const authors = [testAuthor1, testAuthor2];
      const error = "No messages to show... Are you sure you are at the right URL?";
      expect(renderObject.options).toStrictEqual({ messagesPageNumber, authors, messagesSlicedByTen, error });
    });
    it("should throw an error with the correct message", async () => {
      vi.spyOn(messagesController, "messagesController").mockRejectedValue(new MessagesError("Error fetching messages!", 500));
      await expect(messagesController.messagesController(db, 1)).rejects.toThrow(MessagesError);
      await expect(messagesController.messagesController(db, 1)).rejects.toThrow("Error fetching messages!");
    });
  });
  describe("messagesByAuthorsController tests", () => {
    it("should return with a valid renderObject if data is valid", async () => {
      vi.spyOn(messagesController, "messagesByAuthorsController");
      const renderObject = await messagesController.messagesByAuthorsController(db, [1]);
      const testAuthor1 = { id: 1, name: "Teszt Elek", createdAt: createdAtTime };
      const testMessage1 = { id: 1, authorId: 1, content: "Teszt", messageCreatedAt: createdAtTime };
      const testMessage3 = { id: 3, authorId: 1, content: "Teszt", messageCreatedAt: createdAtTime };
      expect(renderObject.viewName).toBe("author");
      const messages = [testMessage1, testMessage3];
      const author = { id: testAuthor1.id, name: testAuthor1.name, createdAt: testAuthor1.createdAt };
      expect(renderObject.options).toStrictEqual({ author, messages });
    });
    it("should return with a valid renderObject if data is not valid", async () => {
      vi.spyOn(messagesController, "messagesByAuthorsController");
      const renderObject = await messagesController.messagesByAuthorsController(db, [10]);
      expect(renderObject.viewName).toBe("author");
      const messages = [];
      const author = { id: 0, name: "-", createdAt: "-" };
      expect(renderObject.options).toStrictEqual({ author, messages });
    });
    it("should throw an error with the correct message", async () => {
      vi.spyOn(messagesController, "messagesByAuthorsController").mockRejectedValue(new MessagesError("Error fetching messages!", 500));
      await expect(messagesController.messagesByAuthorsController(db, [1])).rejects.toThrow(MessagesError);
      await expect(messagesController.messagesByAuthorsController(db, [1])).rejects.toThrow("Error fetching messages!");
    });
  });
});
