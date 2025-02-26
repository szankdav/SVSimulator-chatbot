var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { logger } from "../../winston/winston.js";
const paramaterValidator = /* @__PURE__ */ __name((params) => {
  for (const param of params) {
    if (typeof param === "string" && param.length === 0) {
      logger.error("String parameter can't be empty!");
      throw new Error("String parameter can't be empty!");
    }
  }
}, "paramaterValidator");
export {
  paramaterValidator
};
