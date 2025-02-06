import { NextFunction, Request, Response } from 'express';
import { getAllMessagesController } from "../controller/message.controller";
import { getAllLetterCountersAuthorsController, getAllLetterCountersController } from "../controller/letterCounter.controller";
import { db } from '../database/database';

export const homeMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const messages = await getAllMessagesController(db);
        const letters = await getAllLetterCountersController(db);
        const authors = await getAllLetterCountersAuthorsController(db);
        res.render("index", { messages, letters, authors });
    } catch (error) {
        next(error);
    }
}