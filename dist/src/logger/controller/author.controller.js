import { DatabaseError } from "../middleware/databaseError.handler";
import { createAuthor, getAllAuthors, getAuthorById, getAuthorByName, getTenAuthors } from "../model/author.model";
export const createAuthorController = async (db, authorParams) => {
    try {
        const params = [authorParams.name, authorParams.createdAt];
        const existingAuthor = await getAuthorByName(db, [authorParams.name]);
        if (!existingAuthor) {
            await createAuthor(db, params);
            console.log('Author added to the database!');
        }
    }
    catch (error) {
        console.error("Error creating author:", error);
        throw new DatabaseError("Error creating author", 500);
    }
};
export const getAllAuthorsController = async (db) => {
    try {
        return await getAllAuthors(db);
    }
    catch (error) {
        console.error("Error fetching all authors:", error);
        throw new DatabaseError("Error fetching all authors", 500);
    }
};
export const getAuthorByNameController = async (db, name) => {
    try {
        const params = [name];
        return await getAuthorByName(db, params);
    }
    catch (error) {
        console.error("Error fetching author:", error);
        throw new DatabaseError("Error fetching author", 500);
    }
};
export const getAuthorByIdController = async (db, id) => {
    try {
        const params = [id];
        return await getAuthorById(db, params);
    }
    catch (error) {
        console.error("Error fetching author:", error);
        throw new DatabaseError("Error fetching author", 500);
    }
};
export const getTenAuthorsController = async (db, params) => {
    try {
        return await getTenAuthors(db, params);
    }
    catch (error) {
        console.error("Error fetching ten authors:", error);
        throw new DatabaseError("Error fetching ten authors", 500);
    }
};
