"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const http_error_1 = require("../errors/http.error");
const jwt_1 = require("../utils/jwt");
const auth_enum_1 = require("../enums/auth.enum");
class AuthMiddleware {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.authenticate = async (req) => {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                throw new http_error_1.HttpError(401, "Authorization header missing");
            }
            const token = authHeader.split(" ")[1];
            if (!token) {
                throw new http_error_1.HttpError(401, "Token missing");
            }
            const decoded = (0, jwt_1.verifyToken)(token);
            const user = await this.userRepository.findById(decoded.id);
            if (!user) {
                throw new http_error_1.HttpError(401, "Invalid token");
            }
            if (!user.isActive) {
                throw new http_error_1.HttpError(403, "Account disabled");
            }
            if (decoded.tokenVersion !== user.tokenVersion) {
                throw new http_error_1.HttpError(401, "Token invalidated");
            }
            const authorizedUser = (req.user = {
                id: user._id,
                role: decoded.role,
                tokenVersion: user.tokenVersion,
                email: user.email,
            });
            return authorizedUser;
        };
        this.protect = async (req, _res, next) => {
            try {
                await this.authenticate(req);
                console.log("auth header:", req.headers.authorization);
                next();
            }
            catch (error) {
                next(error);
            }
        };
        this.authorize = (...roles) => async (req, _res, next) => {
            try {
                const user = await this.authenticate(req);
                if (roles.length > 0 && !roles.includes(user.role)) {
                    throw new http_error_1.HttpError(403, "Forbidden");
                }
                next();
            }
            catch (error) {
                next(error);
            }
        };
        this.adminGuard = this.authorize(auth_enum_1.userRole.ADMIN);
    }
}
exports.AuthMiddleware = AuthMiddleware;
