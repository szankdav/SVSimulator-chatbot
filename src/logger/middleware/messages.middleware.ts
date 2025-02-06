import { NextFunction, Response, Request } from "express";
import { getAllMessagesController, getTenMessagesController, getMessagesByAuthorIdController } from "../controller/message.controller";
import { getAllAuthorsController, getAuthorByIdController } from "../controller/author.controller";
import { DatabaseError } from "./databaseError.handler";
import { db } from "../database/database";

export const messagesMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.params['page']);
        const messagesPageNumber = (await getAllMessagesController(db)).length / 10;
        if (page > messagesPageNumber) {
            throw new DatabaseError("Page not found!", 404);
        }
        const messagesSlicedByTen = await getTenMessagesController(db, [page == 1 ? 0 : (page - 1) * 10]);
        const authors = await getAllAuthorsController(db);
        res.render("messages", { authors, messagesSlicedByTen, messagesPageNumber });
    } catch (error) {
        next(error);
    }
}

export const messagesByAuthorsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorId = req.params['id'];
        const author = await getAuthorByIdController(db, authorId);
        const pageNumberOfAuthor = parseInt(authorId) % 10 != 0 ? Math.floor(parseInt(authorId) / 10) + 1 : parseInt(authorId) / 10;
        const messages = await getMessagesByAuthorIdController(db, [authorId]);
        res.render("author", { messages, author, pageNumberOfAuthor });
    } catch (error) {
        next(error);
    }
}