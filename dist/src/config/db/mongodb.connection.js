"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToMongoDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../env");
const connectToMongoDB = async () => {
    try {
        await mongoose_1.default.connect(env_1.env.db.mongoUri);
        console.log("Connected to MongoDB successfully");
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};
exports.connectToMongoDB = connectToMongoDB;
