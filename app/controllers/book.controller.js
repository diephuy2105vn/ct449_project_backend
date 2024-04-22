const BookService = require("../services/book.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const fs = require("fs");
const url = require("url");
const path = require("path");

exports.create = async (req, res, next) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send("No file uploaded.");
    }

    if (Object.keys(req.body).length === 0)
        return next(new ApiError(400, "Data to create can not be empty"));

    req.body.imageUrl = "http://localhost:3000/public/images/" + file.filename;

    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.create(req.body);
        return res.send(document);
    } catch (error) {
        console.log(error.message);
        return next(
            new ApiError(500, "An error occurred while creating the book")
        );
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const bookService = new BookService(MongoDB.client);
        const { name } = req.query;

        if (name) documents = await bookService.findByName(name);
        else documents = await bookService.find({});

        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(
                500,
                "An error occurred while retrieving books " + error.message
            )
        );
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.findById(req.params.id);

        if (!document) return next(new ApiError(404, "Book not found"));

        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Error retrieving book with id = ${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0)
        return next(new ApiError(400, "Data to update can not be empty"));

    try {
        const bookService = new BookService(MongoDB.client);
        const oldBook = await bookService.findById(req.params.id);
        if (!oldBook) return next(new ApiError(404, "Book not found"));

        if (req.file) {
            if (oldBook.imageUrl) {
                const oldImageName = path.basename(
                    url.parse(oldBook.imageUrl).pathname
                );
                fs.unlinkSync(
                    path.join(__dirname, "../../public/images", oldImageName)
                );
            }
            req.body.imageUrl =
                "http://localhost:3000/public/images/" + req.file.filename;
        }
        const document = await bookService.update(req.params.id, req.body);
        return res.send({ message: "Book was updated successfully" });
    } catch (error) {
        console.log(error.message);
        return next(
            new ApiError(
                500,
                `Error retrieving book with id = ${req.params.id}`
            )
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const oldBook = await bookService.findById(req.params.id);
        if (!oldBook) return next(new ApiError(404, "Book not found"));

        if (oldBook.imageUrl) {
            const oldImageName = path.basename(
                url.parse(oldBook.imageUrl).pathname
            );
            fs.unlinkSync(
                path.join(__dirname, "../../public/images", oldImageName)
            );
        }
        await bookService.delete(req.params.id);
        return res.send({ message: "Book was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Could not delete book with id = ${req.params.id}`
            )
        );
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const deleteCount = await bookService.deleteAll();

        return res.send({
            message: `${deleteCount} books were deleted successfully`,
        });
    } catch (error) {
        return next(
            new ApiError(500, `An error occurred while remove all books`)
        );
    }
};

exports.findNew = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const size = req.query.size ? req.query.size : 10;
        const documents = await bookService.findNew(size);
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(
                500,
                "An error occurred while retrieving books " + error.message
            )
        );
    }
};
