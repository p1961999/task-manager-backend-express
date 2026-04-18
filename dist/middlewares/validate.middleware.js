"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse({
                body: req.body,
                params: req.params,
                query: req.query,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({
                    message: "Validation Failed",
                    errors: error.flatten(),
                });
            }
            next(error);
        }
    };
};
exports.validate = validate;
