"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshUserToken = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const http_status_codes_1 = require("http-status-codes");
const user_model_1 = require("../models/user.model");
const ApiError_1 = require("../utils/ApiError");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
const refresh_token_model_1 = require("../models/refresh-token.model");
const registerUser = async (data) => {
    const exitingUser = await user_model_1.User.findOne({ email: data.email });
    if (exitingUser) {
        throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.CONFLICT, "Email already registered");
    }
    const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
    const user = await user_model_1.User.create({
        name: data.name,
        email: data.email,
        password: hashedPassword
    });
    return {
        id: user._id,
        name: user.name,
        email: user.email
    };
};
exports.registerUser = registerUser;
const loginUser = async (data) => {
    const user = await user_model_1.User.findOne({ email: data.email });
    if (!user) {
        throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid Credentials");
    }
    const isCorrectPassword = await bcryptjs_1.default.compare(data.password, user.password);
    if (!isCorrectPassword) {
        throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid Credentials");
    }
    const payload = {
        userId: user._id.toString(),
        email: user.email
    };
    const authAccessToken = (0, jwt_1.signAccessToken)(payload);
    const refreshToken = (0, jwt_1.signRefreshToken)(payload);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await refresh_token_model_1.RefreshToken.create({
        user: user._id,
        token: refreshToken,
        expiresAt
    });
    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        },
        authAccessToken,
        refreshToken
    };
};
exports.loginUser = loginUser;
const logoutUser = async (refreshToken) => {
    await refresh_token_model_1.RefreshToken.findOneAndDelete({ token: refreshToken });
};
exports.logoutUser = logoutUser;
const refreshUserToken = async (refreshToken) => {
    const storedToken = await refresh_token_model_1.RefreshToken.findOne({ token: refreshToken });
    if (!storedToken) {
        throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid refresh token");
    }
    const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
    const authAccessToken = (0, jwt_1.signAccessToken)({
        userId: payload.userId,
        email: payload.email
    });
    return { authAccessToken };
};
exports.refreshUserToken = refreshUserToken;
