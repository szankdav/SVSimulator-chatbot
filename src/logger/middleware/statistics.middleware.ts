import { NextFunction, Request, Response } from "express";
import { getAuthorByIdController, getAllAuthorsController } from "../controller/author.controller";
import { getLetterCountersByAuthorIdController } from "../controller/letterCounter.controller";
import { usageStatisticByIdController } from "../controller/statistics.controller";
import { DatabaseError } from "./databaseError.handler";
import { db } from "../database/database";

export const statisticsByAuthorMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorId = req.params['id'];
        const author = await getAuthorByIdController(db, authorId);
        if (!author) {
            throw new DatabaseError("Page not found!", 404);
        }
        const authors = await getAllAuthorsController(db);
        const letterCounters = await getLetterCountersByAuthorIdController(db, [authorId]);
        const letterStatistics = await usageStatisticByIdController(db, [authorId]);
        res.render("statistics", { letterCounters, author, authors, letterStatistics });
    } catch (error) {
        next(error);
    }
}