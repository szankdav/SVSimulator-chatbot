import { Database } from "sqlite3";
import { SqlParams } from "../types/sqlparams.type";
import { getLetterCountersByAuthorIdController } from "./letterCounter.controller";
import { LetterStatistic } from "../types/letterStatistic.type";
import { DatabaseError } from "../middleware/databaseError.handler";

export const usageStatisticByIdController = async (db: Database, params: SqlParams): Promise<LetterStatistic[]> => {
    try {
        let letterStatistics: LetterStatistic[] = [];
        let sumOfLetterCount: number = 0;
        const letterCountersByAuthorId = await getLetterCountersByAuthorIdController(db, params);
        letterCountersByAuthorId.map(x => sumOfLetterCount += x.count);
        for (const letterCounter of letterCountersByAuthorId) {
            const letterStatistic: LetterStatistic = { [letterCounter.letter]: Math.round(((letterCounter.count / sumOfLetterCount) * 100)) };
            letterStatistics.push(letterStatistic);
        }
        return letterStatistics;
    } catch (error) {
        console.error("Error calculating letter statistics:", error);
        throw new DatabaseError("Error calculating letter statistics:", 500);
    }
}