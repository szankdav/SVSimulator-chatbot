import { Database } from "sqlite3";
import { SqlParams } from "../types/sqlparams.type";
import { LetterStatistic } from "../types/letterStatistic.type";
import { StatisticError } from "../utils/customErrorClasses/statisticError.class";
import { getAllAuthors, getAuthorById } from "../model/author.model";
import { getLetterCountersByAuthorId } from "../model/letterCounter.model";
import { RenderObject } from "../types/renderObject.type";

export const statisticsByAuthorController = async (db: Database, params: SqlParams): Promise<RenderObject> => {
    try {
        let author = await getAuthorById(db, params);
        if (!author) { author = { id: 0, name: "-", createdAt: "-" } };

        const authors = await getAllAuthors(db);
        const letterCounters = await getLetterCountersByAuthorId(db, params);
        const letterStatistics = await getLetterStatictics(db, params);

        let renderObject: RenderObject = {
            viewName: "statistics",
            options: { author, authors, letterCounters, letterStatistics }
        };

        return renderObject;
    } catch (error) {
        console.error("Error creating letter statistics renderObject:", error);
        throw new StatisticError("Error creating letter statistics renderObject:", 500);
    }
}

export const getLetterStatictics = async (db: Database, params: SqlParams): Promise<LetterStatistic[]> => {
    try {
        let letterStatistics: LetterStatistic[] = [];
        let sumOfLetterCount: number = 0;
        const letterCountersByAuthorId = await getLetterCountersByAuthorId(db, params);
        letterCountersByAuthorId.map(x => sumOfLetterCount += x.count);
        for (const letterCounter of letterCountersByAuthorId) {
            const letterStatistic: LetterStatistic = { [letterCounter.letter]: Math.round(((letterCounter.count / sumOfLetterCount) * 100)) };
            letterStatistics.push(letterStatistic);
        }
        return letterStatistics;
    } catch (error) {
        console.error("Error calculating letter statistics:", error);
        throw new StatisticError("Error calculating letter statistics:", 500);
    }
}