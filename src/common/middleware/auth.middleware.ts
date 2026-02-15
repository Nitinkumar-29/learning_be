// common/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { HttpError } from "../errors/http.error";

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new HttpError(401, "Authorization header missing");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new HttpError(401, "Token missing");
    }

    const decoded = verifyToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};
