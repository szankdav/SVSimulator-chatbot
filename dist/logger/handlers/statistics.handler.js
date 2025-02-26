var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { statisticsByAuthorController } from "../controller/statistics.controller.js";
import { db } from "../database/database.js";
import { logger } from "../../winston/winston.js";
const statisticsByAuthorHandler = /* @__PURE__ */ __name(async (req, res, next) => {
  try {
    const authorId = [req.params["id"]];
    const renderObject = await statisticsByAuthorController(db, authorId);
    res.render(renderObject.viewName, renderObject.options);
  } catch (error) {
    logger.error("Statistics handler error:", error);
    next(error);
  }
}, "statisticsByAuthorHandler");
export {
  statisticsByAuthorHandler
};
