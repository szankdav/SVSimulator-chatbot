import { NextFunction, Request, Response } from "express";
import { authorsController } from "../controller/author.controller";
import { db } from "../database/database";

export const authorsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.params['page']);
        const renderObject = await authorsController(db, page);
        res.render(renderObject.viewName, renderObject.options);
    } catch (error) {
        next(error);
    }
}