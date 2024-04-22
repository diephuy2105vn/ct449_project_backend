const PublishingCompanyService = require("../services/publishingCompany.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    try {
        const publishingCompanyService = new PublishingCompanyService(
            MongoDB.client
        );
        const document = await publishingCompanyService.create(req.body);

        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                "An error occurred while creating  publishing company" +
                    error.message
            )
        );
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const publishingCompanyService = new PublishingCompanyService(
            MongoDB.client
        );
        const documents = await publishingCompanyService.find({});
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(
                500,
                "An error occurred while retrieving publishing companies " +
                    error.message
            )
        );
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const publishingCompanyService = new PublishingCompanyService(
            MongoDB.client
        );
        const document = await publishingCompanyService.findById(req.params.id);

        if (!document)
            return next(new ApiError(404, "Publishing company not found"));

        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Error retrieving Publishing company with id = ${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0)
        return next(new ApiError(400, "Data to update can not be empty"));

    try {
        const publishingCompanyService = new PublishingCompanyService(
            MongoDB.client
        );
        const document = await publishingCompanyService.update(
            req.params.id,
            req.body
        );

        if (!document)
            return next(new ApiError(404, "Publishing company not found"));
        return res.send({
            message: "Publishing company was updated successfully",
        });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(
                500,
                `Error retrieving Publishing company with id = ${req.params.id}`
            )
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const publishingCompanyService = new PublishingCompanyService(
            MongoDB.client
        );
        const document = await publishingCompanyService.delete(req.params.id);

        if (!document)
            return next(new ApiError(404, "Publishing company not found"));

        return res.send({
            message: "Publishing company was deleted successfully",
        });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Could not delete Publishing company with id = ${req.params.id}`
            )
        );
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const publishingCompanyService = new PublishingCompanyService(
            MongoDB.client
        );
        const deleteCount = await publishingCompanyService.deleteAll();

        return res.send({
            message: `${deleteCount}  publishing companies were deleted successfully`,
        });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `An error occurred while remove all  publishing companies`
            )
        );
    }
};
