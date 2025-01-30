// import { beforeEach, vi, describe, it, expect, afterEach } from "vitest";
// import * as messageCounterController from "./message.controller.ts";
// import * as messageCounterModel from "../model/message.model.ts";
// import * as letterCounterController from "./letterCounter.controller.ts";
// import { createTables } from "../database/tables.ts";
// import sqlite3, { Database } from "sqlite3";
// import { MessageModel } from "../model/message.model.ts";
// import { DatabaseError } from "../middleware/databaseError.handler.ts";

// let db: Database;

// describe("messageController tests", () => {
//     beforeEach(async () => {
//         vi.clearAllMocks();
//         db = new sqlite3.Database(":memory:");
//         await createTables(db);
//         vi.spyOn(console, 'error').mockImplementation(() => { });
//         vi.spyOn(console, 'log').mockImplementation(() => { });
//     });

//     afterEach(() => {
//         db.close();
//         vi.restoreAllMocks();
//     });

//     describe("createMessageController tests", () => {
//         it("should create a new message", async () => {
//             const messageParams: MessageModel = { id: 0, author: "author1", content: "message", messageCreatedAt: new Date().toLocaleString() };
//             vi.spyOn(messageCounterController, 'createMessageController');
//             vi.spyOn(messageCounterModel, 'createMessage');

//             await messageCounterController.createMessageController(db, messageParams);
//             expect(messageCounterModel.createMessage).toHaveBeenCalledWith(db, [messageParams.author, messageParams.content, messageParams.messageCreatedAt]);
//         });

//         it("should call createLetterCountersController with the given params", async () => {
//             const messageParams: MessageModel = { id: 0, author: "author1", content: "message", messageCreatedAt: new Date().toLocaleString() };
//             vi.spyOn(messageCounterController, 'createMessageController');
//             vi.spyOn(letterCounterController, 'createLetterCountersController');

//             await messageCounterController.createMessageController(db, messageParams);
//             expect(letterCounterController.createLetterCountersController).toHaveBeenCalledWith(db, messageParams);
//         })

//         it("should throw an error with the correct message", async () => {
//             const messageParams: MessageModel = { id: 0, author: "author1", content: "message", messageCreatedAt: new Date().toLocaleString() };
//             vi.spyOn(messageCounterModel, 'createMessage').mockRejectedValue(new Error("Error creating message"));

//             await expect(messageCounterController.createMessageController(db, messageParams)).rejects.toThrow(DatabaseError);
//             await expect(messageCounterController.createMessageController(db, messageParams)).rejects.toThrow("Error creating message");
//         })
//     })

//     describe("getAllMessageController", () => {
//         it("should get all messages", async () => {
//             const testMessageParams1: MessageModel = { id: 0, author: "author1", content: "message", messageCreatedAt: new Date().toLocaleString() };
//             const testMessageParams2: MessageModel = { id: 0, author: "author2", content: "message", messageCreatedAt: new Date().toLocaleString() };

//             await messageCounterController.createMessageController(db, testMessageParams1);
//             await messageCounterController.createMessageController(db, testMessageParams2);
//             const result = await messageCounterController.getAllMessagesController(db);

//             expect(result[0].author).toBe(testMessageParams1.author);
//             expect(result[1].author).toBe(testMessageParams2.author);
//         })

//         it("should throw an error with the correct message", async () => {
//             vi.spyOn(messageCounterModel, 'getAllMessages').mockRejectedValue(new Error("Error fetching all messages"));

//             await expect(messageCounterController.getAllMessagesController).rejects.toThrow(DatabaseError);
//             await expect(messageCounterController.getAllMessagesController).rejects.toThrow("Error fetching all messages");
//         })
//     })
// });
