import { NextFunction, Request, Response } from "express";
import { getAllAuthorsController, getTenAuthorsController } from "../controller/author.controller";
import { DatabaseError } from "./databaseError.handler";
import { db } from "../database/database";

export const authorsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.params['page']);
        const authorsPageNumber = (await getAllAuthorsController(db)).length / 10;
        if (page > authorsPageNumber) {
            throw new DatabaseError("Page not found!", 404);
        }
        const authorsSlicedByTen = await getTenAuthorsController(db, [page == 1 ? 0 : (page - 1) * 10]);
        res.render("authors", { authorsSlicedByTen, authorsPageNumber });
    } catch (error) {
        next(error);
    }
}