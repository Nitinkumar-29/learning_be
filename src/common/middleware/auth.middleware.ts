import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/http.error";
import { verifyToken } from "../utils/jwt";
import { AuthRepository } from "../../modules/auth/infrastructure/persistence/document/auth.repository";

export class AuthMiddleware {
  constructor(private readonly userRepository: AuthRepository) {}

  protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new HttpError(401, "Authorization header missing");
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        throw new HttpError(401, "Token missing");
      }

      const decoded = verifyToken(token) as any;

      const user = await this.userRepository.findById(decoded.id);

      if (!user) {
        throw new HttpError(401, "Invalid token");
      }
      if (!user.isActive) {
        throw new HttpError(403, "Account disabled");
      }
      console.log("Decoded token version:", decoded,user);
      if (decoded.tokenVersion !== user.tokenVersion) {
        throw new HttpError(401, "Token invalidated");
      }

      req.user = {
        id: user._id,
        role: user.role,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
}
