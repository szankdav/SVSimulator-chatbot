import { NextFunction, Request, Response } from "express";
import { statisticsByAuthorController } from "../controller/statistics.controller.js";
import { db } from "../database/database.js";

export const statisticsByAuthorHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorId = [req.params['id']];
        const renderObject = await statisticsByAuthorController(db, authorId);
        res.render(renderObject.viewName, renderObject.options);
    } catch (error) {
        next(error);
    }
}