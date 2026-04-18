"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const ApiError_1 = require("../utils/ApiError");
const http_status_codes_1 = require("http-status-codes");
const jwt_1 = require("../utils/jwt");
const authMiddleware = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new ApiError_1.ApiError(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Unauthorized"));
    }
    const token = authHeader.split(" ")[1];
    const payload = (0, jwt_1.verifyAccessToken)(token);
    req.user = {
        userId: payload.userId,
        email: payload.email
    };
    next();
};
exports.authMiddleware = authMiddleware;
