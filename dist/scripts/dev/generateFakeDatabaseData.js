import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const devFakerPath = join(__dirname, "../../logger/database/faker/dataFaker.ts");
const { runFaker } = await import(`file://${devFakerPath}`);
await runFaker();
