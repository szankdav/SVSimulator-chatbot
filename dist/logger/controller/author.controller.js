var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { AuthorsError } from "../utils/customErrorClasses/authorsError.class.js";
import { getAllAuthors, getTenAuthors } from "../model/author.model.js";
const authorsController = /* @__PURE__ */ __name(async (db, page) => {
  try {
    if (isNaN(page)) {
      const renderObject2 = { viewName: "error", options: { err: "Page not found!" } };
      return renderObject2;
    }
    const authorsPageNumber = Math.ceil((await getAllAuthors(db)).length / 10);
    const authorsSlicedByTen = await getTenAuthors(db, [page == 1 ? 0 : (page - 1) * 10]);
    let error = "";
    if (page > authorsPageNumber) {
      error = "No authors to show... Are you sure you are at the right URL?";
    }
    ;
    let renderObject = {
      viewName: "authors",
      options: { authorsPageNumber, authorsSlicedByTen, error }
    };
    return renderObject;
  } catch (error) {
    console.error("Error creating authors renderObject:", error);
    throw new AuthorsError("Error fetching authors!", 500);
  }
}, "authorsController");
export {
  authorsController
};
