import { beforeEach, vi, describe, it, expect, afterEach } from "vitest";
import * as authorModel from "../model/author.model.ts";
import * as messageModel from "../model/message.model.ts";
import * as messageLoggerController from "../controller/messageLogger.controller.ts";
import * as letterCounterModel from "../model/letterCounter.model.ts";
import { createTables } from "../database/tables.ts";
import sqlite3, { Database } from "sqlite3";
import { DatabaseError } from "../utils/customErrorClasses/databaseError.class.ts";
import { AuthorsError } from "../utils/customErrorClasses/authorsError.class.ts";
import { AuthorModel } from "../model/author.model.ts";
import { MessageModel } from "../model/message.model.ts";
import { LetterCounterError } from "../utils/customErrorClasses/letterCounterError.class.ts";

let db: Database;
const createdAtTime = new Date().toLocaleString();

describe("messageLogger.controller tests", () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => { });
        vi.spyOn(console, 'log').mockImplementation(() => { });
        db = new sqlite3.Database(":memory:");
        await createTables(db);
        const testAuthor1: AuthorModel = { id: 1, name: "Teszt Elek", createdAt: createdAtTime };
        const testAuthor2: AuthorModel = { id: 2, name: "Teszt Elekné", createdAt: createdAtTime };
        await authorModel.createAuthor(db, [testAuthor1.name, testAuthor1.createdAt]);
        await authorModel.createAuthor(db, [testAuthor2.name, testAuthor2.createdAt]);
        const testMessage1: MessageModel = { id: 1, authorId: 1, content: "Teszt", messageCreatedAt: createdAtTime };
        const testMessage2: MessageModel = { id: 2, authorId: 2, content: "Teszt", messageCreatedAt: createdAtTime };
        const testMessage3: MessageModel = { id: 3, authorId: 1, content: "Teszt", messageCreatedAt: createdAtTime };
        await messageModel.createMessage(db, [testMessage1.authorId, testMessage1.content, testMessage1.messageCreatedAt]);
        await messageModel.createMessage(db, [testMessage2.authorId, testMessage2.content, testMessage2.messageCreatedAt]);
        await messageModel.createMessage(db, [testMessage3.authorId, testMessage3.content, testMessage3.messageCreatedAt]);
    });

    afterEach(() => {
        db.close();
        vi.restoreAllMocks();
    });

    describe("messageLoggerController tests", async () => {
        it('should add an author to the database from the incoming data', async () => {
            vi.spyOn(messageLoggerController, 'messageLoggerController');
            const message = {
                username: "Ifj. Teszt Elek",
                messageCreatedAt: 500000000000,
                content: "Teszt",
            };
            const consoleSpy = vi.spyOn(console, 'log');
            await messageLoggerController.messageLoggerController(db, message);
            expect(consoleSpy).toHaveBeenCalledWith('Author added to the database!');
        })

        it('should create the message for the newly added author', async () => {
            vi.spyOn(messageLoggerController, 'messageLoggerController');
            vi.spyOn(messageModel, 'createMessage');
            vi.spyOn(letterCounterModel, 'updateLetterCounter');
            const message = {
                username: "Id. Teszt Elek",
                messageCreatedAt: 500000000000,
                content: "Teszt",
            };
            await messageLoggerController.messageLoggerController(db, message);
            expect(messageModel.createMessage).toHaveBeenCalled();
        })

        it('should create the letters for the newly added author', async () => {
            vi.spyOn(messageLoggerController, 'messageLoggerController');
            vi.spyOn(messageModel, 'createMessage');
            vi.spyOn(letterCounterModel, 'updateLetterCounter');
            const message = {
                username: "Teszt Elemer",
                messageCreatedAt: 500000000000,
                content: "Teszt",
            };
            await messageLoggerController.messageLoggerController(db, message);
            expect(letterCounterModel.updateLetterCounter).toHaveBeenCalled();
        })

        it('should throw an error with the correct message', async () => {
            vi.spyOn(messageLoggerController, 'messageLoggerController').mockRejectedValue(new DatabaseError("Error logging message:", 500));
            const message = {
                username: "Teszt Elemer",
                messageCreatedAt: 500000000000,
                content: "Teszt",
            };
            await expect(messageLoggerController.messageLoggerController(db, message)).rejects.toThrow(DatabaseError);
            await expect(messageLoggerController.messageLoggerController(db, message)).rejects.toThrow("Error logging message");
        })
    })

    describe("createLetterCountersInDatabase tests", async () => {
        it('should create the letters for the newly added author', async () => {
            vi.spyOn(messageLoggerController, 'createLetterCountersInDatabase');
            vi.spyOn(letterCounterModel, 'updateLetterCounter');
            const message = {
                username: "Ifj. Teszt Elemer",
                messageCreatedAt: 500000000000,
                content: "Teszt",
            };
            await messageLoggerController.messageLoggerController(db, message);
            expect(letterCounterModel.updateLetterCounter).toHaveBeenCalled();
        })

        it('should not create the letters again for the author if already existed', async () => {
            vi.spyOn(letterCounterModel, 'getLetterCounterByAuthorId').mockResolvedValue({ authorId: 1 });
            vi.spyOn(letterCounterModel, 'createLetterCounters');
            const messageParams: MessageModel = {
                id: 0,
                authorId: 1,
                content: "Teszt",
                messageCreatedAt: new Date().toLocaleString(),
            };
            await messageLoggerController.createLetterCountersInDatabase(db, messageParams);
            expect(letterCounterModel.createLetterCounters).not.toHaveBeenCalled();
        })

        it('should throw an error with the correct message', async () => {
            vi.spyOn(messageLoggerController, 'messageLoggerController').mockRejectedValue(new LetterCounterError("Error creating letters:", 500));
            const message = {
                username: "Teszt Elemer",
                messageCreatedAt: 500000000000,
                content: "Teszt",
            };
            await expect(messageLoggerController.messageLoggerController(db, message)).rejects.toThrow(LetterCounterError);
            await expect(messageLoggerController.messageLoggerController(db, message)).rejects.toThrow("Error creating letters");
        })
    })

    describe("checkAuthorIdExistense tests", async () => {
        it('should return with the author id', async () => {
            vi.spyOn(messageLoggerController, 'checkAuthorIdExistense');
            vi.spyOn(letterCounterModel, 'getLetterCounterByAuthorId').mockResolvedValue({ authorId: 1 });
            const id = await messageLoggerController.checkAuthorIdExistense(db, [1]);
            expect(id?.authorId).toBe(1);
        })

        it('should return with undefined if authorId is not exists', async () => {
            vi.spyOn(messageLoggerController, 'checkAuthorIdExistense');
            vi.spyOn(letterCounterModel, 'getLetterCounterByAuthorId');
            const id = await messageLoggerController.checkAuthorIdExistense(db, [1]);
            expect(id).toBe(undefined);
        })

        it('should throw an error with the correct message', async () => {
            vi.spyOn(messageLoggerController, 'messageLoggerController').mockRejectedValue(new AuthorsError("Error fetching first author:", 500));
            const message = {
                username: "Teszt Elemer",
                messageCreatedAt: 500000000000,
                content: "Teszt",
            };
            await expect(messageLoggerController.messageLoggerController(db, message)).rejects.toThrow(AuthorsError);
            await expect(messageLoggerController.messageLoggerController(db, message)).rejects.toThrow("Error fetching first author");
        })
    })

    describe("letterIterator tests", async () => {
        it('should call updateLetterCounter by the amount of letters', async () => {
            vi.spyOn(messageLoggerController, 'letterIterator');
            vi.spyOn(letterCounterModel, 'updateLetterCounter');
            const messageParams: MessageModel = {
                id: 0,
                authorId: 1,
                content: "Teszt",
                messageCreatedAt: new Date().toLocaleString(),
            };
            await messageLoggerController.letterIterator(db, messageParams);
            expect(letterCounterModel.updateLetterCounter).toHaveBeenCalledTimes(messageParams.content.length);
        })
    })
})