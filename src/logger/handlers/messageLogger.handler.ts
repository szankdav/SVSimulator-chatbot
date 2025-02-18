import { NextFunction, Request, Response } from "express";
import { messageLoggerController } from "../controller/messageLogger.controller.js";
import { db } from "../database/database.js";
import { logger } from "../../winston/winston.js";

export const messageLoggerHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const message = req.body.message;
        await messageLoggerController(db, message);
        res.sendStatus(200);
    } catch (error) {
        logger.error("MessageLogger handler error:", error);
        next(error);
    }
}