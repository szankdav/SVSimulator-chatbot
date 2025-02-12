import { beforeEach, vi, describe, it, expect, afterEach } from "vitest";
import * as authorModel from "../model/author.model";
import * as messageModel from "../model/message.model";
import * as statisticController from "../controller/statistics.controller";
import * as letterCounterModel from "../model/letterCounter.model";
import { createTables } from "../database/tables";
import sqlite3, { Database } from "sqlite3";
import { AuthorModel } from "../model/author.model";
import { MessageModel } from "../model/message.model";
import { RenderObject } from "../types/renderObject.type";
import { StatisticError } from "../utils/customErrorClasses/statisticError.class";
import { LetterStatistic } from "../types/letterStatistic.type";

let db: Database;
const createdAtTime = new Date().toLocaleString();

describe("statisticController tests", () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => { });
        //vi.spyOn(console, 'log').mockImplementation(() => { });
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

    describe("statisticsByAuthorController tests", () => {
        it("should return with a valid renderObject if data is valid", async () => {
            vi.spyOn(statisticController, 'statisticsByAuthorController');
            const renderObject: RenderObject = await statisticController.statisticsByAuthorController(db, [1]);
            const testAuthor1: AuthorModel = { id: 1, name: "Teszt Elek", createdAt: createdAtTime };
            const testAuthor2: AuthorModel = { id: 2, name: "Teszt Elekné", createdAt: createdAtTime };
            const testMessage1: MessageModel = { id: 1, authorId: 1, content: "Teszt", messageCreatedAt: createdAtTime };
            const testMessage3: MessageModel = { id: 3, authorId: 1, content: "Teszt", messageCreatedAt: createdAtTime };

            expect(renderObject.viewName).toBe("statistics");
            const author = { id: testAuthor1.id, name: testAuthor1.name, createdAt: testAuthor1.createdAt };
            const authors = [testAuthor1, testAuthor2];
            const letterCounters = await letterCounterModel.getLetterCountersByAuthorId(db, [1]);
            const letterStatistics = await statisticController.getLetterStatictics(db, [1]);

            expect(renderObject.options).toStrictEqual({ author, authors, letterCounters, letterStatistics });
        });

        it("should return with a valid renderObject if data is not valid", async () => {
            vi.spyOn(statisticController, 'statisticsByAuthorController');
            const renderObject: RenderObject = await statisticController.statisticsByAuthorController(db, [10]);
            const testAuthor1: AuthorModel = { id: 1, name: "Teszt Elek", createdAt: createdAtTime };
            const testAuthor2: AuthorModel = { id: 2, name: "Teszt Elekné", createdAt: createdAtTime };
            const testMessage1: MessageModel = { id: 1, authorId: 1, content: "Teszt", messageCreatedAt: createdAtTime };
            const testMessage3: MessageModel = { id: 3, authorId: 1, content: "Teszt", messageCreatedAt: createdAtTime };

            expect(renderObject.viewName).toBe("statistics");
            const author = { id: 0, name: "-", createdAt: "-" };
            const authors = [{ id: 0, name: "-", createdAt: "-" }];
            const letterCounters = await letterCounterModel.getLetterCountersByAuthorId(db, [1]);
            const letterStatistics = await statisticController.getLetterStatictics(db, [1]);

            expect(renderObject.options).toStrictEqual({ author, authors, letterCounters, letterStatistics });
        });

        it("should throw an error with the correct message", async () => {
            vi.spyOn(statisticController, 'statisticsByAuthorController').mockRejectedValue(new StatisticError("Error creating letter statistics renderObject:", 500));

            await expect(statisticController.statisticsByAuthorController(db, [1])).rejects.toThrow(StatisticError);
            await expect(statisticController.statisticsByAuthorController(db, [1])).rejects.toThrow("Error creating letter statistics renderObject:");
        })
    })

    describe("getLetterStatictics tests", () => {
        it("should return with LetterStatistics array", async () => {
            vi.spyOn(statisticController, 'getLetterStatictics');
            vi.spyOn(letterCounterModel, 'getLetterCountersByAuthorId').mockResolvedValue([
                { id: 1, authorId: 1, letter: "a", count: 4, createdAt: createdAtTime, updatedAt: createdAtTime },
                { id: 1, authorId: 1, letter: "b", count: 6, createdAt: createdAtTime, updatedAt: createdAtTime },
            ]);
            const letterStatistics: LetterStatistic[] = await statisticController.getLetterStatictics(db, [1]);
            expect(letterStatistics).toEqual([{ a: 40 }, { b: 60 }]);
        });

        it("should throw an error with the correct message", async () => {
            vi.spyOn(statisticController, 'statisticsByAuthorController').mockRejectedValue(new StatisticError("Error calculating letter statistics:", 500));

            await expect(statisticController.statisticsByAuthorController(db, [1])).rejects.toThrow(StatisticError);
            await expect(statisticController.statisticsByAuthorController(db, [1])).rejects.toThrow("Error calculating letter statistics:");
        })
    })
});
