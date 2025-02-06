import { Request, Response, NextFunction } from "express";
import { DatabaseError } from "./databaseError.handler";

export const globalErrorHandler = (err: DatabaseError, req: Request, res: Response, next: NextFunction) => {
  console.error("Global Error Handler:", err.message);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).render("error", { err });
};
