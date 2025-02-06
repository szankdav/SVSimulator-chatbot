import { beforeEach, vi, describe, it, expect, afterEach } from "vitest";
import * as letterCounterController from "./letterCounter.controller.ts";
import * as authorController from "../controller/author.controller.ts";
import * as messageController from "../controller/message.controller.ts";
import * as statisticController from "../controller/statistics.controller.ts";
import { createTables } from "../database/tables.ts";
import sqlite3, { Database } from "sqlite3";
import { MessageModel } from "../model/message.model.ts";
import { DatabaseError } from "../middleware/databaseError.handler.ts";
import { AuthorModel } from "../model/author.model.ts";
import { LetterStatistic } from "../types/letterStatistic.type.ts";

let db: Database;
const createdAtTime = new Date().toLocaleString();

describe("statisticController tests", () => {
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

    describe("usageStatisticByIdController tests", () => {
        it("should return with a LetterStatistic array", async () => {
            const testMessageParams1: MessageModel = { id: 1, authorId: 1, content: "Teszt", messageCreatedAt: createdAtTime };
            const testMessageParams2: MessageModel = { id: 2, authorId: 2, content: "Teszt", messageCreatedAt: createdAtTime };

            await letterCounterController.createLetterCountersController(db, testMessageParams1);
            await letterCounterController.createLetterCountersController(db, testMessageParams2);

            const result: LetterStatistic[] = await statisticController.usageStatisticByIdController(db, [testMessageParams1.authorId]);
            expect(result[0]).toStrictEqual({"a": 0});
        });

        it("should throw an error with the correct message", async () => {
            vi.spyOn(statisticController, 'usageStatisticByIdController').mockRejectedValue(new DatabaseError("Error calculating letter statistics:", 500));

            await expect(statisticController.usageStatisticByIdController(db, [1])).rejects.toThrow(DatabaseError);
            await expect(statisticController.usageStatisticByIdController(db, [1])).rejects.toThrow("Error calculating letter statistics:");
        })
    })
});
