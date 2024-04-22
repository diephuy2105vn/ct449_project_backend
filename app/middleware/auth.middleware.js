const AuthService = require("../services/auth.service");
const ApiError = require("../api-error");
const authMiddleWare = async (req, res, next) => {
    try {
        const authService = new AuthService();
        const token = req.cookies["token"];
        const verifyToken = await authService.verifyToken(token);
        if (verifyToken) {
            req.body.user = verifyToken.data.user;
            return next();
        }

        return next(new ApiError(404, "Token is not valid"));
    } catch (err) {
        console.log(err.message);
        return next(new ApiError(404, "Permission denied"));
    }
};

module.exports = authMiddleWare;
