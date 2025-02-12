var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { messagesByAuthorsController, messagesController } from "../controller/message.controller.js";
import { db } from "../database/database.js";
const messagesHandler = /* @__PURE__ */ __name(async (req, res, next) => {
  try {
    const page = parseInt(req.params["page"]);
    const renderObject = await messagesController(db, page);
    res.render(renderObject.viewName, renderObject.options);
  } catch (error) {
    next(error);
  }
}, "messagesHandler");
const messagesByAuthorsHandler = /* @__PURE__ */ __name(async (req, res, next) => {
  try {
    const authorId = [parseInt(req.params["id"])];
    const renderObject = await messagesByAuthorsController(db, authorId);
    res.render(renderObject.viewName, renderObject.options);
  } catch (error) {
    next(error);
  }
}, "messagesByAuthorsHandler");
export {
  messagesByAuthorsHandler,
  messagesHandler
};
