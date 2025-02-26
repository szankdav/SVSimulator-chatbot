var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { logger } from "../../winston/winston.js";
const homeHandler = /* @__PURE__ */ __name(async (req, res, next) => {
  try {
    res.render("index");
  } catch (error) {
    logger.error("Home handler error:", error);
    next(error);
  }
}, "homeHandler");
export {
  homeHandler
};
