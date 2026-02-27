import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/http.error";
import { verifyToken } from "../utils/jwt";
import { AuthRepository } from "../../modules/auth/infrastructure/persistence/abstraction/auth.repository";
import { userRole } from "../enums/auth.enum";

export class AuthMiddleware {
  constructor(private readonly userRepository: AuthRepository) {}

  private authenticate = async (req: Request) => {
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
    if (decoded.tokenVersion !== user.tokenVersion) {
      throw new HttpError(401, "Token invalidated");
    }

    req.user = {
      id: user._id,
      role: user.role,
    };

    return user;
  };

  protect = async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await this.authenticate(req);
      next();
    } catch (error) {
      next(error);
    }
  };

  authorize =
    (...roles: userRole[]) =>
    async (req: Request, _res: Response, next: NextFunction) => {
      try {
        const user = await this.authenticate(req);
        if (roles.length > 0 && !roles.includes(user.role)) {
          throw new HttpError(403, "Forbidden");
        }
        next();
      } catch (error) {
        next(error);
      }
    };

  adminGuard = this.authorize(userRole.ADMIN);
}
