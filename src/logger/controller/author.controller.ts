import { Database } from "sqlite3";
import { SqlParams } from "../types/sqlparams.type";
import { DatabaseError } from "../middleware/databaseError.handler";
import { AuthorModel, createAuthor, getAllAuthors, getAuthorByName } from "../model/author.model";

export const createAuthorController = async (db: Database, authorParams: AuthorModel): Promise<void> => {
    try {
        const params: SqlParams = [authorParams.name, authorParams.createdAt];
        const existingAuthor = await getAuthorByName(db, [authorParams.name]);
        if (!existingAuthor) {
            await createAuthor(db, params);
            console.log('Author added to the database!');
        }
    } catch (error) {
        console.error("Error creating author:", error);
        throw new DatabaseError("Error creating author", 500);
    }
}

export const getAllAuthorsController = async (db: Database): Promise<AuthorModel[]> => {
    try {
        return await getAllAuthors(db);
    } catch (error) {
        console.error("Error fetching all authors:", error);
        throw new DatabaseError("Error fetching all authors", 500);
    }
}

export const getAuthorByNameController = async (db: Database, name: string): Promise<AuthorModel | undefined> => {
    try {
        const params: SqlParams = [name];
        return await getAuthorByName(db, params);
    } catch (error) {
        console.error("Error fetching author:", error);
        throw new DatabaseError("Error fetching author", 500);
    }
}