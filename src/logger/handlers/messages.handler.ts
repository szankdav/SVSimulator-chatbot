import { NextFunction, Response, Request } from "express";
import { messagesByAuthorsController, messagesController } from "../controller/message.controller";
import { db } from "../database/database";

export const messagesHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.params['page']);
        const renderObject = await messagesController(db, page);
        res.render(renderObject.viewName, renderObject.options);
    } catch (error) {
        next(error);
    }
}

export const messagesByAuthorsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorId = [parseInt(req.params['id'])];
        const renderObject = await messagesByAuthorsController(db, authorId);
        res.render(renderObject.viewName, renderObject.options);
    } catch (error) {
        next(error);
    }
}