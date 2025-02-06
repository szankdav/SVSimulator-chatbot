import { startClient } from "./bot/client/client";
import express from 'express';
import path from "path";
import { fileURLToPath } from "url";
import { createTables } from "./logger/database/tables";
import { db } from "./logger/database/database";
import { globalErrorHandler } from "./logger/middleware/globalError.handler";
import { createRandomAuthorsInDatabase } from "./logger/database/faker/dataFaker";
import { DatabaseError } from "./logger/middleware/databaseError.handler";
import { homeMiddleware } from "./logger/middleware/home.middleware";
import { authorsMiddleware } from "./logger/middleware/authors.middleware";
import { messagesMiddleware, messagesByAuthorsMiddleware } from "./logger/middleware/messages.middleware";
import { statisticsByAuthorMiddleware } from "./logger/middleware/statistics.middleware";

// Start bot
startClient();

// Set filepaths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, '/logger/view'));
app.use(express.static(path.join(__dirname, '../public')));
const port = process.env.PORT || 3000;

// Create tables
await createTables(db);

// Create fake datas for database
if (process.env.NODE_ENV === "devDb") {
    await createRandomAuthorsInDatabase(db);
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.get('/home', homeMiddleware);
app.get('/authors/:page', authorsMiddleware)
app.get('/messages/:page', messagesMiddleware)
app.get('/messages/author/:id', messagesByAuthorsMiddleware)
app.get('/statistics/author/:id', statisticsByAuthorMiddleware)

app.use((req, res, next) => {
    next(new DatabaseError("Page not found", 404));
});

app.use(globalErrorHandler);