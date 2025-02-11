import { startClient } from "./bot/client/client";
import express from 'express';
import path from "path";
import { fileURLToPath } from "url";
import { createTables } from "./logger/database/tables";
import { db } from "./logger/database/database";
import { errorHandler } from "./logger/handlers/error.handler";
import { fillDatabaseWithFakeData } from "./logger/database/faker/dataFaker";
import { DatabaseError } from "./logger/utils/customErrorClasses/databaseError.class";
import { homeHandler } from "./logger/handlers/home.handler";
import { authorsHandler } from "./logger/handlers/authors.handler";
import { messagesHandler, messagesByAuthorsHandler } from "./logger/handlers/messages.handler";
import { statisticsByAuthorHandler } from "./logger/handlers/statistics.handler";
import { messageLoggerHandler } from "./logger/handlers/messageLogger.handler";

// Start bot
startClient();

// Set filepaths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, '/logger/view'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json())
const port = process.env.PORT || 3000;

// Create tables
await createTables(db);

// Create fake datas for database
if (process.env.NODE_ENV === "devDb") {
    await fillDatabaseWithFakeData(db);
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.get('/home', homeHandler);
app.get('/authors/:page', authorsHandler);
app.get('/messages/:page', messagesHandler);
app.get('/messages/author/:id', messagesByAuthorsHandler);
app.get('/statistics/author/:id', statisticsByAuthorHandler);
app.post('/logMessage', messageLoggerHandler);
app.use(errorHandler);