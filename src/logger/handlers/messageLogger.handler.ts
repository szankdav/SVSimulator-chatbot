import { NextFunction, Request, Response } from "express";
import { messageLoggerController } from "../controller/messageLogger.controller.js";
import { db } from "../database/database.js";

export const messageLoggerHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const message = req.body.message;
        await messageLoggerController(db, message);
        res.send(JSON.stringify('Message logged!'));
    } catch (error) {
        next(error);
    }
}