var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
const errorHandler = /* @__PURE__ */ __name((req, res, next) => {
  res.status(404).render("error", { err: "Page not found!" });
}, "errorHandler");
export {
  errorHandler
};
