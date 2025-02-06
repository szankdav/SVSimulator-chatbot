import { startClient } from "./bot/client/client";
import express from 'express';
import path from "path";
import { fileURLToPath } from "url";
import { createTables } from "./logger/database/tables";
import { getAllMessagesController, getMessagesByAuthorIdController, getTenMessagesController } from "./logger/controller/message.controller";
import { getAllLetterCountersAuthorsController, getAllLetterCountersController, getLetterCountersByAuthorIdController } from "./logger/controller/letterCounter.controller";
import { db } from "./logger/database/database";
import { globalErrorHandler } from "./logger/middleware/globalError.handler";
import { getAllAuthorsController, getAuthorByIdController, getTenAuthorsController } from "./logger/controller/author.controller";
import { createRandomAuthorsInDatabase } from "./logger/database/faker/dataFaker";
import { usageStatisticByIdController } from "./logger/controller/statistics.controller";
startClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, '/logger/view'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(globalErrorHandler);
const port = process.env.PORT || 3000;
await createTables(db);
if (process.env.NODE_ENV === "devDb") {
    await createRandomAuthorsInDatabase(db);
}
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
app.get('/home', async (req, res, next) => {
    try {
        const messages = await getAllMessagesController(db);
        const letters = await getAllLetterCountersController(db);
        const authors = await getAllLetterCountersAuthorsController(db);
        res.render("index", { messages, letters, authors });
    }
    catch (error) {
        next(error);
    }
});
app.get('/authors/:page', async (req, res, next) => {
    try {
        const page = req.params['page'];
        const authorsPageNumber = (await getAllAuthorsController(db)).length / 10;
        const authorsSlicedByTen = await getTenAuthorsController(db, [parseInt(page) == 1 ? 0 : (parseInt(page) - 1) * 10]);
        res.render("authors", { authorsSlicedByTen, authorsPageNumber });
    }
    catch (error) {
        next(error);
    }
});
app.get('/messages/:page', async (req, res, next) => {
    try {
        const page = req.params['page'];
        const messagesPageNumber = (await getAllMessagesController(db)).length / 10;
        const messagesSlicedByTen = await getTenMessagesController(db, [parseInt(page) == 1 ? 0 : (parseInt(page) - 1) * 10]);
        const authors = await getAllAuthorsController(db);
        res.render("messages", { authors, messagesSlicedByTen, messagesPageNumber });
    }
    catch (error) {
        next(error);
    }
});
app.get('/messages/author/:id', async (req, res, next) => {
    try {
        const authorId = req.params['id'];
        const author = await getAuthorByIdController(db, authorId);
        const pageNumberOfAuthor = parseInt(authorId) % 10 != 0 ? Math.floor(parseInt(authorId) / 10) + 1 : parseInt(authorId) / 10;
        const messages = await getMessagesByAuthorIdController(db, [authorId]);
        res.render("author", { messages, author, pageNumberOfAuthor });
    }
    catch (error) {
        next(error);
    }
});
app.get('/statistics/author/:id', async (req, res, next) => {
    try {
        const authorId = req.params['id'];
        const author = await getAuthorByIdController(db, authorId);
        const authors = await getAllAuthorsController(db);
        const letterCounters = await getLetterCountersByAuthorIdController(db, [authorId]);
        const letterStatistics = await usageStatisticByIdController(db, [authorId]);
        res.render("statistics", { letterCounters, author, authors, letterStatistics });
    }
    catch (error) {
        next(error);
    }
});
