import { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/http.error";
import { env } from "../../config/env";

const isDev = env.app.nodeEnv === "development";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("🔥 Error:", err);

  let statusCode = 500;
  let message = "Internal server error";

  // Custom HttpError (preferred way)
  if (err instanceof HttpError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Mongoose Validation Error
  else if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val: any) => val.message)
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
