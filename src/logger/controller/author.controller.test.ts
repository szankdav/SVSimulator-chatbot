import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as authorModel from "../model/author.model.ts";
import * as messageModel from "../model/message.model.ts";
import { createTables } from "../database/tables.ts";
import sqlite3, { Database } from "sqlite3";
import { AuthorModel } from "../model/author.model.ts";
import { MessageModel } from "../model/message.model.ts";
import * as authorsController from "../controller/author.controller.ts";
import { RenderObject } from "../types/renderObject.type.ts";
import { AuthorsError } from "../utils/customErrorClasses/authorsError.class.ts";

let db: Database;
const createdAtTime = new Date().toLocaleString();

describe('author.controller tests', () => {
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
        await messageModel.createMessage(db, [testMessage1.authorId, testMessage1.content, testMessage1.messageCreatedAt]);
        await messageModel.createMessage(db, [testMessage2.authorId, testMessage2.content, testMessage2.messageCreatedAt]);
    });

    afterEach(() => {
        db.close();
        vi.restoreAllMocks();
    });

    describe('authorsController tests', () => {
        it('should return with a valid renderObject if data is valid', async () => {
            vi.spyOn(authorsController, 'authorsController');
            const renderObject: RenderObject = await authorsController.authorsController(db, 1);
            const testAuthor1: AuthorModel = { id: 1, name: "Teszt Elek", createdAt: createdAtTime };
            const testAuthor2: AuthorModel = { id: 2, name: "Teszt Elekné", createdAt: createdAtTime };
            expect(renderObject.viewName).toBe("authors");
            const authorsPageNumber = 1;
            const authorsSlicedByTen = [testAuthor1, testAuthor2];
            const error = "";
            expect(renderObject.options).toStrictEqual({authorsPageNumber, authorsSlicedByTen, error});
        })

        it('should return with a valid renderObject if data is not valid', async () => {
            vi.spyOn(authorsController, 'authorsController');
            const renderObject: RenderObject = await authorsController.authorsController(db, 10);
            expect(renderObject.viewName).toBe("authors");
            const authorsPageNumber = 1;
            const authorsSlicedByTen = [];
            const error = "No authors to show... Are you sure you are at the right URL?";
            expect(renderObject.options).toStrictEqual({authorsPageNumber, authorsSlicedByTen, error});
        })

        it('should throw an error with the correct message', async () => {
            vi.spyOn(authorsController, 'authorsController').mockRejectedValue(new AuthorsError("Error fetching authors!", 500));

            await expect(authorsController.authorsController(db, 1)).rejects.toThrow(AuthorsError);
            await expect(authorsController.authorsController(db, 1)).rejects.toThrow("Error fetching authors!");
        })
    })
})