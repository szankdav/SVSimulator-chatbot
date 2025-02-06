import { getLetterCountersByAuthorIdController } from "./letterCounter.controller";
import { DatabaseError } from "../middleware/databaseError.handler";
export const usageStatisticByIdController = async (db, params) => {
    try {
        let letterStatistics = [];
        let sumOfLetterCount = 0;
        const letterCountersByAuthorId = await getLetterCountersByAuthorIdController(db, params);
        letterCountersByAuthorId.map(x => sumOfLetterCount += x.count);
        for (const letterCounter of letterCountersByAuthorId) {
            const letterStatistic = { [letterCounter.letter]: Math.round(((letterCounter.count / sumOfLetterCount) * 100)) };
            letterStatistics.push(letterStatistic);
        }
        return letterStatistics;
    }
    catch (error) {
        console.error("Error calculating letter statistics:", error);
        throw new DatabaseError("Error calculating letter statistics:", 500);
    }
};
