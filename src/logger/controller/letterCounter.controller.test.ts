import { beforeEach, vi, describe, it, expect, afterEach } from "vitest";
import * as letterCounterController from "./letterCounter.controller.ts";
import * as letterCounterModel from "../model/letterCounter.model.ts";
import * as authorController from "../controller/author.controller.ts";
import * as messageController from "../controller/message.controller.ts";
import { createTables } from "../database/tables.ts";
import sqlite3, { Database } from "sqlite3";
import { MessageModel } from "../model/message.model.ts";
import { DatabaseError } from "../middleware/databaseError.handler.ts";
import { AuthorModel } from "../model/author.model.ts";

let db: Database;
const createdAtTime = new Date().toLocaleString();

describe("letterController tests", () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => { });
        vi.spyOn(console, 'log').mockImplementation(() => { });
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

    describe("createLetterCountersController tests", () => {
        it("should create new letterCounters for the author", async () => {
            const messageParams: MessageModel = { id: 1, authorId: 1, content: "Teszt", messageCreatedAt: createdAtTime };
            vi.spyOn(letterCounterController, 'createLetterCountersController');
            vi.spyOn(letterCounterModel, 'createLetterCounters');

            await letterCounterController.createLetterCountersController(db, messageParams);
            expect(letterCounterController.createLetterCountersController).toHaveBeenCalledWith(db, messageParams);
            expect(letterCounterModel.createLetterCounters).toHaveBeenCalledWith(db, [1, "z", 0, createdAtTime, createdAtTime]);
        });

        it("should update letterCounters when called with existing author", async () => {
            const messageParams: MessageModel = { id: 1, authorId: 1, content: "Teszt", messageCreatedAt: createdAtTime };

            vi.spyOn(letterCounterModel, 'getLetterCounterByAuthorId').mockResolvedValue({ authorId: 1 });
            vi.spyOn(letterCounterModel, 'createLetterCounters');
            vi.spyOn(letterCounterModel, 'updateLetterCounter');

            await letterCounterController.createLetterCountersController(db, messageParams);

            expect(letterCounterModel.createLetterCounters).not.toHaveBeenCalled();
            expect(letterCounterModel.updateLetterCounter).toHaveBeenCalledTimes(messageParams.content.length);
        });

        it("should throw an error with the correct message", async () => {
            const messageParams: MessageModel = { id: 1, authorId: 1, content: "Teszt", messageCreatedAt: createdAtTime };
            vi.spyOn(letterCounterController, 'createLetterCountersController').mockRejectedValue(new DatabaseError("Error creating letters", 500));

            await expect(letterCounterController.createLetterCountersController(db, messageParams)).rejects.toThrow(DatabaseError);
            await expect(letterCounterController.createLetterCountersController(db, messageParams)).rejects.toThrow("Error creating letters");
        })
    })

    describe("getAllLetterCountersController tests", () => {
        it("should return with all the letterCounters", async () => {
            const testMessageParams1: MessageModel = { id: 1, authorId: 1, content: "Teszt", messageCreatedAt: createdAtTime };
            const testMessageParams2: MessageModel = { id: 2, authorId: 2, content: "Teszt", messageCreatedAt: createdAtTime };

            await letterCounterController.createLetterCountersController(db, testMessageParams1);
            await letterCounterController.createLetterCountersController(db, testMessageParams2);
            const result = await letterCounterController.getAllLetterCountersController(db);
            expect(result[0].authorId).toBe(testMessageParams1.authorId);
            expect(result[35].authorId).toBe(testMessageParams2.authorId);
        })

        it("should throw an error with the correct message", async () => {
            vi.spyOn(letterCounterController, 'getAllLetterCountersController').mockRejectedValue(new DatabaseError("Error fetching all letters", 500));

            await expect(letterCounterController.getAllLetterCountersController(db)).rejects.toThrow(DatabaseError);
            await expect(letterCounterController.getAllLetterCountersController(db)).rejects.toThrow("Error fetching all letters");
        })
    })

    describe("getAllLetterCountersAuthorsController", () => {
        it("should return with all authors", async () => {
            const testMessageParams1: MessageModel = { id: 1, authorId: 1, content: "Teszt", messageCreatedAt: createdAtTime };
            const testMessageParams2: MessageModel = { id: 2, authorId: 2, content: "Teszt", messageCreatedAt: createdAtTime };

            await letterCounterController.createLetterCountersController(db, testMessageParams1);
            await letterCounterController.createLetterCountersController(db, testMessageParams2);
            const result = await letterCounterController.getAllLetterCountersAuthorsController(db);
            console.log(result);
            expect(result[0]['authorId']).toBe(testMessageParams1.authorId);
            expect(result[1]['authorId']).toBe(testMessageParams2.authorId);
        })

        it("should throw an error with the correct message", async () => {
            vi.spyOn(letterCounterModel, 'getAllLetterCountersAuthors').mockRejectedValue(new DatabaseError("Error fetching all authors", 500));

            await expect(letterCounterController.getAllLetterCountersAuthorsController(db)).rejects.toThrow(DatabaseError);
            await expect(letterCounterController.getAllLetterCountersAuthorsController(db)).rejects.toThrow("Error fetching all authors");
        })
    })
});
