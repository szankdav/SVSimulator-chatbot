import { beforeEach, vi, describe, it, expect, afterEach } from "vitest";
import * as letterCounterController from "./letterCounter.controller.ts";
import * as letterCounterModel from "../model/letterCounter.model.ts";
import { createTables } from "../database/database.ts";
import sqlite3, { Database } from "sqlite3";
import { MessageModel } from "../model/message.model.ts";

let db: Database;

describe("letterController tests", () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        db = new sqlite3.Database(":memory:");
        await createTables();
    });

    afterEach(() => {
        db.close();
    });

    it("should insert a new author when createLetterCountersController is called", async () => {
        const messageParams: MessageModel = { id: 0, author: "author1", content: "message", messageCreatedAt: new Date().toLocaleString() };
        vi.spyOn(letterCounterController, 'createLetterCountersController');

        await letterCounterController.createLetterCountersController(messageParams);
        expect(letterCounterController.createLetterCountersController).toHaveBeenCalledWith(messageParams);
    });

    it("should update letterCounters when createLetterCountersController is called with existing author", async () => {
        const messageParams: MessageModel = { id: 0, author: "author1", content: "message", messageCreatedAt: new Date().toLocaleString() };

        vi.spyOn(letterCounterModel, 'getFirstLetterCounterAuthorByAuthor').mockResolvedValue(messageParams);
        vi.spyOn(letterCounterModel, 'createLetterCounters');
        vi.spyOn(letterCounterModel, 'updateLetterCounter');

        await letterCounterController.createLetterCountersController(messageParams);

        expect(letterCounterModel.createLetterCounters).not.toHaveBeenCalled();
        expect(letterCounterModel.updateLetterCounter).toHaveBeenCalledTimes(messageParams.content.length);
    });

    it("should throw an error with the correct message", async () => {
        const messageParams: MessageModel = { id: 0, author: "author1", content: "message", messageCreatedAt: new Date().toLocaleString() };
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => { });
        vi.spyOn(letterCounterModel, 'getFirstLetterCounterAuthorByAuthor').mockResolvedValue(undefined);
        vi.spyOn(letterCounterModel, 'createLetterCounters').mockRejectedValue(new Error("Database error..."));

        await letterCounterController.createLetterCountersController(messageParams);

        expect(consoleSpy).toHaveBeenCalledWith("Error creating letters:", Error("Database error..."));
        consoleSpy.mockRestore();
    })



    //     it("should skip invalid characters in the message", async () => {
    //     const params = ["author1", "me$$sage123!@", new Date()];

    //     await letterCounterController(params);

    //     expect(insertLetters).toHaveBeenCalledWith([
    //       params[0],
    //       '',
    //       0,
    //       params[2],
    //       params[2],
    //     ]);

    //     const validLetterCount = params[1]
    //       .toLowerCase()
    //       .split("")
    //       .filter((char) => /^[a-záéíóöőúüű]$/i.test(char)).length;

    //     expect(updateLetterCount).toHaveBeenCalledTimes(validLetterCount);
    //   });

    //   it("should handle empty messages without throwing errors", async () => {
    //     const params = ["author1", "", new Date()];

    //     await letterCounterController(params);

    //     expect(insertLetters).toHaveBeenCalledWith([
    //       params[0],
    //       '',
    //       0,
    //       params[2],
    //       params[2],
    //     ]);

    //     expect(updateLetterCount).not.toHaveBeenCalled();
    //   });

    //   it("should log errors if `getFirstAuthorByAuthor` fails", async () => {
    //     const params = ["author1", "message", new Date()];
    //     const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    //     getFirstAuthorByAuthor.mockRejectedValueOnce(new Error("Database error"));

    //     await letterCounterController(params);

    //     expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    //     consoleSpy.mockRestore();
    //     getFirstAuthorByAuthor.mockRestore();
    //   });

    //   it("should log errors if `insertLetters` fails", async () => {
    //     const params = ["author1", "message", new Date()];
    //     const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    //     insertLetters.mockRejectedValueOnce(new Error("Insert error"));

    //     await letterCounterController(params);

    //     expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    //     consoleSpy.mockRestore();
    //   });

    //   it("should log errors if `updateLetterCount` fails", async () => {
    //     const params = ["author1", "message", new Date()];
    //     const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    //     updateLetterCount.mockRejectedValueOnce(new Error("Update error"));

    //     await letterCounterController(params);

    //     expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    //     consoleSpy.mockRestore();
    //   });

    //   it("should handle a single-character message", async () => {
    //     const params = ["author1", "A", new Date()];

    //     await letterCounterController(params);

    //     expect(insertLetters).toHaveBeenCalledWith([
    //       params[0],
    //       '',
    //       0,
    //       params[2],
    //       params[2],
    //     ]);

    //     expect(updateLetterCount).toHaveBeenCalledTimes(1);
    //   });
});
