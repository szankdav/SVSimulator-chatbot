import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const productionAuthorModelPath = join(__dirname, "../../logger/model/author.model.js");
const productionDbPath = join(__dirname, "../../logger/database/database.js");


const { deleteAllAuthors } = await import(`file://${productionAuthorModelPath}`);
const { db } = await import(`file://${productionDbPath}`);

await deleteAllAuthors(db);
