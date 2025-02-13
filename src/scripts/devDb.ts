import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Resolve paths
const __dirname = dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const srcPath = join(__dirname, "../logger/database/faker/dataFaker.ts");
const distPath = join(__dirname, "../../dist/logger/database/faker/dataFaker.js");
// Determine the correct path
const modulePath = isProduction ? distPath : srcPath;

// Import dynamically
const { runFaker } = await import(`file://${modulePath}`);

await runFaker();
