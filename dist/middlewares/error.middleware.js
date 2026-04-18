"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMidlleware = void 0;
const ApiError_1 = require("../utils/ApiError");
const http_status_codes_1 = require("http-status-codes");
const errorMidlleware = (err, _req, res, _next) => {
    if (err instanceof ApiError_1.ApiError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: err.message || "Internal server error"
    });
};
exports.errorMidlleware = errorMidlleware;
