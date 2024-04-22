const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const AuthService = require("../services/auth.service");

exports.register = async (req, res, next) => {
    if (!req.body?.username && !req.body?.password) {
        return next(
            new ApiError(400, "Username and password can not be empty")
        );
    }
    try {
        const userService = new UserService(MongoDB.client);
        const userInDB = await userService.findByUsername(req.body?.username);
        if (userInDB) {
            return next(new ApiError(400, "That username is already in use"));
        }
        const document = await userService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, "An error occurred while creating user"));
    }
};

exports.login = async (req, res, next) => {
    if (!req.body?.username && !req.body?.password) {
        return next(
            new ApiError(400, "Username and password can not be empty")
        );
    }
    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.findByUsernameAndPassword(
            req.body.username,
            req.body.password
        );
        if (!document) return next(new ApiError(404, "User is not found"));
        const authService = new AuthService();
        const token = await authService.generateToken(document);
        return res.send({ user: document, token: token });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Error login user with username = ${req.body.username}`
            )
        );
    }
};

exports.refresh = async (req, res, next) => {
    try {
        const authService = new AuthService();
        const token = req.cookies["token"];
        const verifyToken = await authService.verifyToken(token);
        if (verifyToken) {
            const user = verifyToken.data.user;
            return res.send({ user: user, token: token });
        } else {
            new ApiError(404, `Token is not valid`);
        }
    } catch (error) {
        return next(
            new ApiError(500, `Error refreshing token: ${error.message}`)
        );
    }
};
