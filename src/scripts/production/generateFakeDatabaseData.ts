import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const productionFakerPath = join(__dirname, "../../logger/database/faker/dataFaker.js");

const { runFaker } = await import(`file://${productionFakerPath}`);

await runFaker();
