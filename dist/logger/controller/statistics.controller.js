var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { StatisticError } from "../utils/customErrorClasses/statisticError.class.js";
import { getAllAuthors, getAuthorById } from "../model/author.model.js";
import { getLetterCountersByAuthorId } from "../model/letterCounter.model.js";
import { logger } from "../../winston/winston.js";
const statisticsByAuthorController = /* @__PURE__ */ __name(async (db, params) => {
  try {
    let author = await getAuthorById(db, params);
    let authors = await getAllAuthors(db);
    const letterCounters = await getLetterCountersByAuthorId(db, params);
    const letterStatistics = await getLetterStatictics(db, params);
    if (!author) {
      author = { id: 0, name: "-", createdAt: "-" };
      authors = [{ id: 0, name: "-", createdAt: "-" }];
    }
    ;
    let renderObject = {
      viewName: "statistics",
      options: { author, authors, letterCounters, letterStatistics }
    };
    return renderObject;
  } catch (error) {
    logger.error("Error creating letter statistics renderObject:", error);
    throw new StatisticError("Error creating letter statistics renderObject:", 500);
  }
}, "statisticsByAuthorController");
const getLetterStatictics = /* @__PURE__ */ __name(async (db, params) => {
  try {
    let letterStatistics = [];
    let sumOfLetterCount = 0;
    const letterCountersByAuthorId = await getLetterCountersByAuthorId(db, params);
    letterCountersByAuthorId.map((x) => sumOfLetterCount += x.count);
    for (const letterCounter of letterCountersByAuthorId) {
      const letterStatistic = { [letterCounter.letter]: Math.round(letterCounter.count / sumOfLetterCount * 100) };
      letterStatistics.push(letterStatistic);
    }
    return letterStatistics;
  } catch (error) {
    logger.error("Error calculating letter statistics:", error);
    throw new StatisticError("Error calculating letter statistics:", 500);
  }
}, "getLetterStatictics");
export {
  getLetterStatictics,
  statisticsByAuthorController
};
