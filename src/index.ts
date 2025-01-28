import { startClient } from "./bot/client/client";
import express, { Request, Response } from 'express';
import path from "path";
import { fileURLToPath } from "url";
import { createTables } from "./logger/database/database";
import { getAllMessagesController } from "./logger/controller/message.controller";
import { getAllLetterCountersAuthorsController, getAllLetterCountersController } from "./logger/controller/letterCounter.controller";

startClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, '/logger/view'));
app.use(express.static(path.join(__dirname, '../public')));

const port = process.env.PORT || 3000;

await createTables();

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.get('/', async (req: Request, res: Response) => {
    const messages = await getAllMessagesController();
    const letters = await getAllLetterCountersController();
    const authors = await getAllLetterCountersAuthorsController(); 
    res.render("index", { messages, letters, authors });
});
