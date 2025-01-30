import { beforeEach, vi, describe, it, expect, afterEach } from "vitest";
import * as letterCounterController from "./letterCounter.controller.ts";
import * as letterCounterModel from "../model/letterCounter.model.ts";
import * as authorController from "../controller/author.controller.ts";
import * as messageController from "../controller/message.controller.ts";
import * as messageModel from "../model/message.model.ts";
import { createTables } from "../database/tables.ts";
import sqlite3, { Database } from "sqlite3";
import { MessageModel } from "../model/message.model.ts";
import { DatabaseError } from "../middleware/databaseError.handler.ts";
import { SqlParams } from "../types/sqlparams.type.ts";
import { AuthorModel } from "../model/author.model.ts";

let db: Database;

describe("letterController tests", () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        db = new sqlite3.Database(":memory:");
        await createTables(db);
        const createdAtTime = new Date().toLocaleString()
        const testAuthor: AuthorModel = {id: 1, name: "Teszt Elek", createdAt: createdAtTime}; 
        await authorController.createAuthorController(db, testAuthor);
        const testMessage: MessageModel = {id: 1, authorId: 1, content: "Teszt", messageCreatedAt: createdAtTime};
        await messageController.createMessageController(db, testMessage);
        vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        db.close();
        vi.restoreAllMocks();
    });

    describe("createLetterCountersController tests", () => {
        it("should create new letterCounters for the author", async () => {
            const createdAtTime = new Date().toLocaleString()
            const messageParams: MessageModel = {id: 1, authorId: 1, content: "Teszt", messageCreatedAt: createdAtTime};

            vi.spyOn(letterCounterController, 'createLetterCountersController');
            vi.spyOn(letterCounterModel, 'createLetterCounters');

            await letterCounterController.createLetterCountersController(db, messageParams);
            expect(letterCounterController.createLetterCountersController).toHaveBeenCalledWith(db, messageParams);
            //expect(letterCounterModel.createLetterCounters).toHaveBeenCalledWith(db, [1, "z", 0, createdAtTime, createdAtTime]);
        });

        // it("should update letterCounters when createLetterCountersController is called with existing author", async () => {
        //     const messageParams: MessageModel = { id: 0, author: "author1", content: "message", messageCreatedAt: new Date().toLocaleString() };

        //     vi.spyOn(letterCounterModel, 'getFirstLetterCounterAuthorByAuthor').mockResolvedValue(messageParams);
        //     vi.spyOn(letterCounterModel, 'createLetterCounters');
        //     vi.spyOn(letterCounterModel, 'updateLetterCounter');

        //     await letterCounterController.createLetterCountersController(db, messageParams);

        //     expect(letterCounterModel.createLetterCounters).not.toHaveBeenCalled();
        //     expect(letterCounterModel.updateLetterCounter).toHaveBeenCalledTimes(messageParams.content.length);
        // });

        // it("should throw an error with the correct message", async () => {
        //     const messageParams: MessageModel = { id: 0, author: "author1", content: "message", messageCreatedAt: new Date().toLocaleString() };
        //     vi.spyOn(letterCounterModel, 'getFirstLetterCounterAuthorByAuthor').mockResolvedValue(undefined);
        //     vi.spyOn(letterCounterModel, 'createLetterCounters').mockRejectedValue(new Error("Error creating letters"));

        //     await expect(letterCounterController.createLetterCountersController(db, messageParams)).rejects.toThrow(DatabaseError);
        //     await expect(letterCounterController.createLetterCountersController(db, messageParams)).rejects.toThrow("Error creating letters");
        // })
    })

    // describe("getAllLetterCountersController tests", () => {
    //     it("should return with all the letterCounters", async () => {
    //         const testMessageParams1: MessageModel = { id: 0, author: "author1", content: "message", messageCreatedAt: new Date().toLocaleString() };
    //         const testMessageParams2: MessageModel = { id: 0, author: "author2", content: "message", messageCreatedAt: new Date().toLocaleString() };

    //         await letterCounterController.createLetterCountersController(db, testMessageParams1);
    //         await letterCounterController.createLetterCountersController(db, testMessageParams2);
    //         const result = await letterCounterController.getAllLetterCountersController(db);

    //         expect(result[0].author).toBe(testMessageParams1.author);
    //         expect(result[35].author).toBe(testMessageParams2.author);
    //     })

    //     it("should throw an error with the correct message", async () => {
    //         vi.spyOn(letterCounterModel, 'getAllLetterCounters').mockRejectedValue(new Error("Error fetching all letters"));

    //         await expect(letterCounterController.getAllLetterCountersController(db)).rejects.toThrow(DatabaseError);
    //         await expect(letterCounterController.getAllLetterCountersController(db)).rejects.toThrow("Error fetching all letters");
    //     })
    // })

    // describe("getAllLetterCountersAuthorsController", () => {
    //     it("should return with all authors", async () => {
    //         const testMessageParams1: MessageModel = { id: 0, author: "author1", content: "message", messageCreatedAt: new Date().toLocaleString() };
    //         const testMessageParams2: MessageModel = { id: 0, author: "author2", content: "message", messageCreatedAt: new Date().toLocaleString() };

    //         await letterCounterController.createLetterCountersController(db, testMessageParams1);
    //         await letterCounterController.createLetterCountersController(db, testMessageParams2);
    //         const result = await letterCounterController.getAllLetterCountersAuthorsController(db);

    //         expect(result[0].author).toBe(testMessageParams1.author);
    //         expect(result[1].author).toBe(testMessageParams2.author);
    //     })

    //     it("should throw an error with the correct message", async () => {
    //         vi.spyOn(letterCounterModel, 'getAllLetterCountersAuthors').mockRejectedValue(new Error("Error fetching all authors"));

    //         await expect(letterCounterController.getAllLetterCountersAuthorsController(db)).rejects.toThrow(DatabaseError);
    //         await expect(letterCounterController.getAllLetterCountersAuthorsController(db)).rejects.toThrow("Error fetching all authors");
    //     })
    // })
});
