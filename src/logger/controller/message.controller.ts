import { Database } from "sqlite3";
import { getAllMessages, getTenMessages, getMessagesByAuthorId } from "../model/message.model.js";
import { SqlParams } from "../types/sqlparams.type.js";
import { MessagesError } from "../utils/customErrorClasses/messagesError.class.js";
import { RenderObject } from "../types/renderObject.type.js";
import { getAllAuthors, getAuthorById } from "../model/author.model.js";

export const messagesController = async (db: Database, page: number): Promise<RenderObject> => {
    try {
        if (isNaN(page)) { 
            const renderObject: RenderObject = { viewName: "error", options: { err: "Page not found!" } } 
            return renderObject; 
        }
        const messagesPageNumber = Math.ceil((await getAllMessages(db)).length / 10);
        const messagesSlicedByTen = await getTenMessages(db, [page === 1 ? 0 : (page - 1) * 10]);
        const authors = await getAllAuthors(db);
        let error: string = "";
        if (page > messagesPageNumber) { error = "No messages to show... Are you sure you are at the right URL?" };

        let renderObject: RenderObject = {
            viewName: "messages",
            options: { messagesPageNumber, authors, messagesSlicedByTen, error }
        };


        return renderObject;
    } catch (error) {
        console.error("Error creating messages renderObject:", error);
        throw new MessagesError("Error fetching messages!", 500);
    }
}

export const messagesByAuthorsController = async (db: Database, params: SqlParams): Promise<RenderObject> => {
    try {
        let author = await getAuthorById(db, params);
        let messages = await getMessagesByAuthorId(db, params);
        if (!author) { 
            author = { id: 0, name: "-", createdAt: "-" };
            messages = []; 
        };

        let renderObject: RenderObject = {
            viewName: "author",
            options: { author, messages }
        };

        return renderObject;
    } catch (error) {
        console.error("Error creating messages renderObject:", error);
        throw new MessagesError("Error fetching messages!", 500);
    }
}