const OrderBookService = require("../services/orderBook.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    if (!req.body?.bookId) {
        return next(new ApiError(400, "Book id can not be empty"));
    }

    try {
        const orderBookService = new OrderBookService(MongoDB.client);
        const document = await orderBookService.create(req.body);

        return res.send(document);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occurred while creating order book")
        );
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const orderBookService = new OrderBookService(MongoDB.client);
        const documents = await orderBookService.find({});

        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(
                500,
                "An error occurred while retrieving order books " +
                    error.message
            )
        );
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const orderBookService = new OrderBookService(MongoDB.client);
        const document = await orderBookService.findById(req.params.id);

        if (!document) return next(new ApiError(404, "Order book not found"));

        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Error retrieving Order book with id = ${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0)
        return next(new ApiError(400, "Data to update can not be empty"));

    try {
        const orderBookService = new OrderBookService(MongoDB.client);
        const document = await orderBookService.update(req.params.id, req.body);

        if (!document) return next(new ApiError(404, "Order book not found"));
        return res.send({
            message: "Order book was updated successfully",
        });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(
                500,
                `Error retrieving Order book with id = ${req.params.id}`
            )
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const orderBookService = new OrderBookService(MongoDB.client);
        const document = await orderBookService.delete(req.params.id);

        if (!document) return next(new ApiError(404, "Order book not found"));

        return res.send({
            message: "Order book was deleted successfully",
        });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(
                500,
                `Could not delete Order book with id = ${req.params.id}`
            )
        );
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const orderBookService = new OrderBookService(MongoDB.client);
        const deleteCount = await orderBookService.deleteAll();

        return res.send({
            message: `${deleteCount} order book were deleted successfully`,
        });
    } catch (error) {
        return next(
            new ApiError(500, `An error occurred while remove all order books`)
        );
    }
};
