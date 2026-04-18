"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.login = exports.register = void 0;
const http_status_codes_1 = require("http-status-codes");
const asyncHandler_1 = require("../utils/asyncHandler");
const auth_service_1 = require("../services/auth.service");
exports.register = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await (0, auth_service_1.registerUser)(req.body);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        message: "User registered successfully",
        user
    });
});
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, auth_service_1.loginUser)(req.body);
    res.status(http_status_codes_1.StatusCodes.OK).json({
        message: "Login successful",
        ...result
    });
});
exports.refresh = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, auth_service_1.refreshUserToken)(req.body.refreshToken);
    res.status(http_status_codes_1.StatusCodes.OK).json({
        message: "Access token refreshed",
        ...result
    });
});
exports.logout = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await (0, auth_service_1.logoutUser)(req.body.refreshToken);
    res.status(http_status_codes_1.StatusCodes.OK).json({
        message: "Logged out successfully"
    });
});
