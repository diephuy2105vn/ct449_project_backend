const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const authRouter = require("./app/routes/auth.route");
const booksRouter = require("./app/routes/book.route");
const ordersRouter = require("./app/routes/orderBook.route");
const publishingCompaniesRoute = require("./app/routes/publishingCompany.route");
const authMiddleWare = require("./app/middleware/auth.middleware");
const path = require("path");
const ApiError = require("./app/api-error");

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(
    "/public/images",
    express.static(path.join(__dirname, "public/images"))
);
app.use("/api/auth", authRouter);
app.use("/api/companies", publishingCompaniesRoute);
app.use("/api/orders", authMiddleWare, ordersRouter);
app.use("/api/books", booksRouter);
app.get("/", (req, res) => {
    res.json({ message: "Welcome to book application." });
});
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;
