export const globalErrorHandler = (err, req, res, next) => {
    console.error("Global Error Handler:", err.message);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).render("error", {
        title: "Error",
        message: err.message || "Internal Server Error",
    });
};
