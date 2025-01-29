import { startClient } from "./bot/client/client";
import express, { NextFunction, Request, Response } from 'express';
import path from "path";
import { fileURLToPath } from "url";
import { createTables } from "./logger/database/tables";
import { getAllMessagesController } from "./logger/controller/message.controller";
import { getAllLetterCountersAuthorsController, getAllLetterCountersController } from "./logger/controller/letterCounter.controller";
import { db } from "./logger/database/database";
import { globalErrorHandler } from "./logger/middleware/globalError.handler";

// Start bot
startClient();

// Set filepaths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, '/logger/view'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(globalErrorHandler);
const port = process.env.PORT || 3000;

// Create tables
await createTables(db);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
    // Get datas for render
    try {
        const messages = await getAllMessagesController(db);
        const letters = await getAllLetterCountersController(db);
        const authors = await getAllLetterCountersAuthorsController(db);
        res.render("index", { messages, letters, authors });
    } catch (error) {
        next(error);
    }
});
