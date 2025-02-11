import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as authorModel from "../model/author.model.ts";
import * as messageModel from "../model/message.model.ts";
import { createTables } from "../database/tables.ts";
import sqlite3, { Database } from "sqlite3";
import { AuthorModel } from "../model/author.model.ts";
import { MessageModel } from "../model/message.model.ts";
import * as authorsController from "../controller/author.controller.ts";
import { RenderObject } from "../types/renderObject.type.ts";

let db: Database;
const createdAtTime = new Date().toLocaleString();

describe('authorController tests', () => {
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

        // it('should not create author again if already in the database', async () => {
        //     const authorParams: AuthorModel = { id: 1, name: "Teszt Elek", createdAt: createdAtTime };
        //     vi.spyOn(authorModel, 'createAuthor');
        //     vi.spyOn(authorModel, 'getAuthorByName').mockResolvedValue({ id: 1, name: "Teszt Elek", createdAt: createdAtTime });

        //     await authorController.createAuthorController(db, authorParams);
        //     expect(authorModel.createAuthor).not.toHaveBeenCalled();
        // })

        // it('should throw an error with the correct message', async () => {
        //     const authorParams: AuthorModel = { id: 1, name: "Teszt Elek", createdAt: createdAtTime };
        //     vi.spyOn(authorController, 'createAuthorController').mockRejectedValue(new DatabaseError("Error creating author", 500));

        //     await expect(authorController.createAuthorController(db, authorParams)).rejects.toThrow(DatabaseError);
        //     await expect(authorController.createAuthorController(db, authorParams)).rejects.toThrow("Error creating author");
        // })
    })
})