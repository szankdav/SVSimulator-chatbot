import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Resolve paths
const __dirname = dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const srcPath = join(__dirname, "../logger/model/author.model.ts");
const distPath = join(__dirname, "../../dist/logger/model/author.model.js");
const srcDbPath = join(__dirname, "../logger/database/database.js");
const distDbPath = join(__dirname, "../../dist/logger/database/database.js");
// Determine the correct path
const modulePath = isProduction ? distPath : srcPath;
const dbPath = isProduction ? distDbPath : srcDbPath;
console.log(dbPath)
// Import dynamically

const { deleteAllAuthors } = await import(`file://${modulePath}`);
const { db } = await import(`file://${dbPath}`);

await deleteAllAuthors(db);
