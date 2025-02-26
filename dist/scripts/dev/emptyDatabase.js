import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const devAuthorModelPath = join(__dirname, "../../logger/model/author.model.ts");
const devDbPath = join(__dirname, "../../logger/database/database.js");
const { deleteAllAuthors } = await import(`file://${devAuthorModelPath}`);
const { db } = await import(`file://${devDbPath}`);
await deleteAllAuthors(db);
