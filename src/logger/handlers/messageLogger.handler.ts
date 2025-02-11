import { NextFunction, Request, Response } from "express";
import { messageLoggerController } from "../controller/messageLogger.controller";
import { db } from "../database/database";

export const messageLoggerHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const message = req.body.message;
        await messageLoggerController(db, message);
        res.send(JSON.stringify('Message logged!'));
    } catch (error) {
        next(error);
    }
}