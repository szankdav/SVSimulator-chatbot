var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { authorsController } from "../controller/author.controller.js";
import { db } from "../database/database.js";
import { logger } from "../../winston/winston.js";
const authorsHandler = /* @__PURE__ */ __name(async (req, res, next) => {
  try {
    const page = parseInt(req.params["page"]);
    const renderObject = await authorsController(db, page);
    res.render(renderObject.viewName, renderObject.options);
  } catch (error) {
    logger.error("Author handler error:", error);
    next(error);
  }
}, "authorsHandler");
export {
  authorsHandler
};
