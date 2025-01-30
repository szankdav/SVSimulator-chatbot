// import { afterEach, beforeEach, describe, it, vi } from "vitest";
// import sqlite3, { Database } from "sqlite3";
// import { createTables } from "../database/tables";
// import * as authorController from "./author.controller";

// let db: Database;

// describe('authorController tests', () => {
//     beforeEach(async () => {
//         vi.clearAllMocks();
//         db = new sqlite3.Database(":memory:");
//         await createTables(db);
//         vi.spyOn(console, 'error').mockImplementation(() => { });
//     });

//     afterEach(() => {
//         db.close();
//         vi.restoreAllMocks();
//     });

//     describe('createAuthorController tests', () => {
//         it('should create new author in database', async () => {
//             const createdAtTime = new Date().toLocaleString()
//             const authorParams: AuthorModel = { id: 0, author: "author1", authorCreatedAt: createdAtTime };
//             vi.spyOn(authorController, '');

//             await letterCounterController.createLetterCountersController(db, messageParams);
//             expect(letterCounterModel.createLetterCounters).toHaveBeenCalledWith(db, ["author1", "z", 0, createdAtTime, createdAtTime]);
//         })
//     })
// })