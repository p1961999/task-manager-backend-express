"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
        console.error("AsyncHandler Error:", error);
        next(error);
    });
};
exports.asyncHandler = asyncHandler;
