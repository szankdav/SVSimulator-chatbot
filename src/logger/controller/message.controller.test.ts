import { beforeEach, vi, describe, it, expect, afterEach } from "vitest";
import * as messageCounterController from "./message.controller.ts";
import * as messageCounterModel from "../model/message.model.ts";
import * as authorController from "../controller/author.controller.ts";
import * as messageController from "../controller/message.controller.ts";
import { createTables } from "../database/tables.ts";
import sqlite3, { Database } from "sqlite3";
import { MessageModel } from "../model/message.model.ts";
import { DatabaseError } from "../middleware/databaseError.handler.ts";
import { AuthorModel } from "../model/author.model.ts";
import { createRandomAuthor, createRandomMessage } from "../database/faker/dataFaker.ts"
import { createAuthorController, getAuthorByNameController } from "../controller/author.controller.ts";

let db: Database;
const createdAtTime = new Date().toLocaleString();

describe("messageController tests", () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => { });
        //vi.spyOn(console, 'log').mockImplementation(() => { });
        db = new sqlite3.Database(":memory:");
        await createTables(db);
        const testAuthor1: AuthorModel = { id: 1, name: "Teszt Elek", createdAt: createdAtTime };
        const testAuthor2: AuthorModel = { id: 2, name: "Teszt Elekné", createdAt: createdAtTime };
        await authorController.createAuthorController(db, testAuthor1);
        await authorController.createAuthorController(db, testAuthor2);
        const testMessage1: MessageModel = { id: 1, authorId: 1, content: "Teszt", messageCreatedAt: createdAtTime };
        const testMessage2: MessageModel = { id: 2, authorId: 2, content: "Teszt", messageCreatedAt: createdAtTime };
        await messageController.createMessageController(db, testMessage1);
        await messageController.createMessageController(db, testMessage2);
    });

    afterEach(() => {
        db.close();
        vi.restoreAllMocks();
    });

    describe("createMessageController tests", () => {
        it("should create a new message", async () => {
            const messageParams: MessageModel = { id: 1, authorId: 1, content: "Teszt", messageCreatedAt: createdAtTime };
            vi.spyOn(messageCounterController, 'createMessageController');

            await messageCounterController.createMessageController(db, messageParams);
            expect(messageCounterController.createMessageController).toHaveBeenCalledWith(db, messageParams);
        });

        it("should call createMessage with the correct params", async () => {
            const messageParams: MessageModel = { id: 1, authorId: 1, content: "Teszt", messageCreatedAt: createdAtTime };
            vi.spyOn(messageCounterModel, 'createMessage');

            await messageCounterController.createMessageController(db, messageParams);
            expect(messageCounterModel.createMessage).toHaveBeenCalledWith(db, [messageParams.authorId, messageParams.content, messageParams.messageCreatedAt]);
        })

        it("should throw an error with the correct message", async () => {
            const messageParams: MessageModel = { id: 1, authorId: 1, content: "Teszt", messageCreatedAt: createdAtTime };
            vi.spyOn(messageCounterController, 'createMessageController').mockRejectedValue(new DatabaseError("Error creating message", 500));

            await expect(messageCounterController.createMessageController(db, messageParams)).rejects.toThrow(DatabaseError);
            await expect(messageCounterController.createMessageController(db, messageParams)).rejects.toThrow("Error creating message");
        })
    })

    describe("getAllMessageController", () => {
        it("should get all messages", async () => {
            const testMessageParams1: MessageModel = { id: 1, authorId: 1, content: "Teszt", messageCreatedAt: createdAtTime };
            const testMessageParams2: MessageModel = { id: 2, authorId: 2, content: "Teszt", messageCreatedAt: createdAtTime };

            await messageCounterController.createMessageController(db, testMessageParams1);
            await messageCounterController.createMessageController(db, testMessageParams2);
            const result = await messageCounterController.getAllMessagesController(db);

            expect(result[0].authorId).toBe(testMessageParams1.authorId);
            expect(result[1].authorId).toBe(testMessageParams2.authorId);
        })

        it("should throw an error with the correct message", async () => {
            vi.spyOn(messageCounterController, 'getAllMessagesController').mockRejectedValue(new DatabaseError("Error fetching all messages", 500));

            await expect(messageCounterController.getAllMessagesController).rejects.toThrow(DatabaseError);
            await expect(messageCounterController.getAllMessagesController).rejects.toThrow("Error fetching all messages");
        })
    })

    describe("getMessagesByAuthorIdController tests", () => {
        it("should return with the messages by the given author id", async () => {
            const testMessageParams1: MessageModel = { id: 1, authorId: 1, content: "Teszt", messageCreatedAt: createdAtTime };
            const testMessageParams2: MessageModel = { id: 2, authorId: 1, content: "Teszt teszt", messageCreatedAt: createdAtTime };

            await messageCounterController.createMessageController(db, testMessageParams1);
            await messageCounterController.createMessageController(db, testMessageParams2);
            const result = await messageCounterController.getMessagesByAuthorIdController(db, [testMessageParams1.authorId]);

            expect(result[0].authorId).toBe(testMessageParams1.authorId);
            expect(result[1].authorId).toBe(testMessageParams2.authorId);
            expect(result[0].content).toBe(testMessageParams1.content);
            expect(result[2].content).toBe(testMessageParams2.content);
        })

        it("should throw an error with the correct message", async () => {
            vi.spyOn(messageCounterController, 'getMessagesByAuthorIdController').mockRejectedValue(new DatabaseError("Error fetching messages by author id", 500));
            
            await expect(messageCounterController.getMessagesByAuthorIdController(db, [1])).rejects.toThrow(DatabaseError);
            await expect(messageCounterController.getMessagesByAuthorIdController(db, [1])).rejects.toThrow("Error fetching messages by author id");
        })
    })

    describe("getTenMessagesController tests", () => {
        it("should return with ten messages, according to the offset number", async () => {
            const randomMessagesArray: MessageModel[] = [];
            for (let i = 0; i < 30; i++) {
                const randomAuthor = createRandomAuthor();
                await createAuthorController(db, randomAuthor);
                const createdAuthor = await getAuthorByNameController(db, randomAuthor.name);
                const randomMessage = createRandomMessage({ authorId: createdAuthor?.id });
                randomMessagesArray.push(randomMessage);
                await messageController.createMessageController(db, randomMessage);
            }

            const result = await messageController.getTenMessagesController(db, [(2 - 1) * 10]);
            expect(result[1].content).toBe(randomMessagesArray[9].content);
        })

        it("should throw an error with the correct message", async () => {
            vi.spyOn(messageController, 'getTenMessagesController').mockRejectedValue(new DatabaseError("Error fetching ten messages", 500));

            await expect(messageController.getTenMessagesController(db, [1])).rejects.toThrow(DatabaseError);
            await expect(messageController.getTenMessagesController(db, [1])).rejects.toThrow("Error fetching ten messages");
        })
    })
});
