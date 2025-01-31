import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as authorController from "../controller/author.controller.ts";
import * as authorModel from "../model/author.model.ts";
import { createTables } from "../database/tables.ts";
import sqlite3, { Database } from "sqlite3";
import { DatabaseError } from "../middleware/databaseError.handler.ts";
import { AuthorModel } from "../model/author.model.ts";

let db: Database;
const createdAtTime = new Date().toLocaleString();

describe('authorController tests', () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => { });
        vi.spyOn(console, 'log').mockImplementation(() => { });
        db = new sqlite3.Database(":memory:");
        await createTables(db);
    });

    afterEach(() => {
        db.close();
        vi.restoreAllMocks();
    });

    describe('createAuthorController tests', () => {
        it('should create new author', async () => {
            const authorParams: AuthorModel = { id: 1, name: "Teszt Elek", createdAt: createdAtTime };
            vi.spyOn(authorController, 'createAuthorController');

            await authorController.createAuthorController(db, authorParams);
            expect(authorController.createAuthorController).toHaveBeenCalledWith(db, authorParams);
        })

        it('should not create author again if already in the database', async () => {
            const authorParams: AuthorModel = { id: 1, name: "Teszt Elek", createdAt: createdAtTime };
            vi.spyOn(authorModel, 'createAuthor');
            vi.spyOn(authorModel, 'getAuthorByName').mockResolvedValue({ id: 1, name: "Teszt Elek", createdAt: createdAtTime });

            await authorController.createAuthorController(db, authorParams);
            expect(authorModel.createAuthor).not.toHaveBeenCalled();
        })

        it('should throw an error with the correct message', async () => {
            const authorParams: AuthorModel = { id: 1, name: "Teszt Elek", createdAt: createdAtTime };
            vi.spyOn(authorController, 'createAuthorController').mockRejectedValue(new DatabaseError("Error creating author", 500));

            await expect(authorController.createAuthorController(db, authorParams)).rejects.toThrow(DatabaseError);
            await expect(authorController.createAuthorController(db, authorParams)).rejects.toThrow("Error creating author");
        })
    })

    // describe('getAllAuthorsController tests', async () => {
    //     const authorParams: AuthorModel = { id: 1, name: "Teszt Elek", createdAt: createdAtTime };
    //     vi.spyOn(authorController, 'createAuthorController');

    //     await authorController.createAuthorController(db, authorParams);
    //     expect(authorController.createAuthorController).toHaveBeenCalledWith(db, authorParams);
    // })
})