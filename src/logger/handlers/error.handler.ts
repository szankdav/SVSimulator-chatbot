import { Request, Response, NextFunction } from "express";

export const errorHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).render("error", { err: "Page not found!" });
};
