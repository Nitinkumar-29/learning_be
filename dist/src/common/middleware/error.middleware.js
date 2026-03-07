"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const http_error_1 = require("../errors/http.error");
const env_1 = require("../../config/env");
const isDev = env_1.env.app.nodeEnv === "development";
const errorHandler = (err, req, res, next) => {
    console.error("🔥 Error:", err);
    let statusCode = 500;
    let message = "Internal server error";
    // Custom HttpError (preferred way)
    if (err instanceof http_error_1.HttpError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    // Mongoose Validation Error
    else if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ");
    }
    // Duplicate Key Error (MongoDB)
    else if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0];
        message = `${field} already exists`;
    }
    // Invalid ObjectId
    else if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid resource ID";
    }
    // JWT errors
    else if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
    }
    else if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired";
    }
    return res.status(statusCode).json({
        success: false,
        message,
        // ...(isDev && { stack: err.stack }) // show stack only in dev
    });
};
exports.errorHandler = errorHandler;
