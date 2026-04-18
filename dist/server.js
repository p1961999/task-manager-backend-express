"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const env_1 = require("./config/env");
const startServer = async () => {
    try {
        await (0, db_1.connectDB)();
        app_1.default.listen(env_1.env.PORT, () => {
            console.log(`Server running on port ${env_1.env.PORT}`);
        });
    }
    catch (error) {
        console.error("Server failed to start", error);
        process.exit(1);
    }
};
startServer();
