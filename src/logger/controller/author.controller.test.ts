import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as authorController from "../controller/author.controller.ts";
import * as authorModel from "../model/author.model.ts";
import { createTables } from "../database/tables.ts";
import sqlite3, { Database } from "sqlite3";
import { DatabaseError } from "../middleware/databaseError.handler.ts";
import { AuthorModel } from "../model/author.model.ts";
import { createRandomAuthor } from "../database/faker/dataFaker.ts";

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

    describe("getAllAuthorsController tests", () => {
            it("should return with all the authors", async () => {
                const testAuthorParams1: AuthorModel = { id: 1, name: "Teszt Elek", createdAt: createdAtTime };
                const testAuthorParams2: AuthorModel = { id: 2, name: "Teszt Elekné", createdAt: createdAtTime };

                await authorController.createAuthorController(db, testAuthorParams1);
                await authorController.createAuthorController(db, testAuthorParams2);
                const result = await authorController.getAllAuthorsController(db);

                expect(result[0].name).toBe(testAuthorParams1.name);
                expect(result[1].name).toBe(testAuthorParams2.name);
            })
    
            it("should throw an error with the correct message", async () => {
                vi.spyOn(authorController, 'getAllAuthorsController').mockRejectedValue(new DatabaseError("Error fetching all authors", 500));
                
                await expect(authorController.getAllAuthorsController(db)).rejects.toThrow(DatabaseError);
                await expect(authorController.getAllAuthorsController(db)).rejects.toThrow("Error fetching all authors");
            })
        })

        describe("getAuthorByNameController tests", () => {
            it("should return with the author by the given name", async () => {
                const testAuthorParams1: AuthorModel = { id: 1, name: "Teszt Elek", createdAt: createdAtTime };
                const testAuthorParams2: AuthorModel = { id: 2, name: "Teszt Elekné", createdAt: createdAtTime };

                await authorController.createAuthorController(db, testAuthorParams1);
                await authorController.createAuthorController(db, testAuthorParams2);
                const result = await authorController.getAuthorByNameController(db, testAuthorParams1.name);

                expect(result?.name).toBe(testAuthorParams1.name);
            })
    
            it("should throw an error with the correct message", async () => {
                vi.spyOn(authorController, 'getAuthorByNameController').mockRejectedValue(new DatabaseError("Error fetching author", 500));
                
                await expect(authorController.getAuthorByNameController(db, "Teszt Elek")).rejects.toThrow(DatabaseError);
                await expect(authorController.getAuthorByNameController(db, "Teszt Elek")).rejects.toThrow("Error fetching author");
            })
        })

        describe("getTenAuthorsController tests", () => {
            it("should return with ten authors, according to the offset number", async () => {
                const randomAuthorsArray: AuthorModel[] = [];
                for (let i = 0; i < 30; i++) {
                    const randomAuthor =  createRandomAuthor();
                    randomAuthorsArray.push(randomAuthor);
                    await authorController.createAuthorController(db, randomAuthor);
                }

                const result = await authorController.getTenAuthorsController(db, [(2 - 1) * 10]);
                expect(result[1].name).toBe(randomAuthorsArray[11].name);
            })
    
            it("should throw an error with the correct message", async () => {
                vi.spyOn(authorController, 'getTenAuthorsController').mockRejectedValue(new DatabaseError("Error fetching ten authors", 500));
                
                await expect(authorController.getTenAuthorsController(db, [1])).rejects.toThrow(DatabaseError);
                await expect(authorController.getTenAuthorsController(db, [1])).rejects.toThrow("Error fetching ten authors");
            })
        })
})