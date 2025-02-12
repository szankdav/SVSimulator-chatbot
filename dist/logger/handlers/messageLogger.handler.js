var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { messageLoggerController } from "../controller/messageLogger.controller.js";
import { db } from "../database/database.js";
const messageLoggerHandler = /* @__PURE__ */ __name(async (req, res, next) => {
  try {
    const message = req.body.message;
    await messageLoggerController(db, message);
    res.send(JSON.stringify("Message logged!"));
  } catch (error) {
    next(error);
  }
}, "messageLoggerHandler");
export {
  messageLoggerHandler
};
