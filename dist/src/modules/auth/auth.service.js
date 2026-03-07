"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const http_error_1 = require("../../common/errors/http.error");
const jwt_1 = require("../../common/utils/jwt");
const bcrypt = require("bcryptjs");
const crypto_1 = __importDefault(require("crypto"));
const event_bus_1 = require("../integration-events/event-bus");
const auth_events_1 = require("../integration-events/events/auth.events");
class AuthService {
    constructor(authRepository, emailService) {
        this.authRepository = authRepository;
        this.emailService = emailService;
    }
    async registerUser(registerDto) {
        const hashPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.authRepository.createUser({
            ...registerDto,
            password: hashPassword,
        });
        event_bus_1.eventBus.emit(auth_events_1.authEvents.USER_REGISTERED, {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
            occurredAt: new Date(),
        });
        return user;
    }
    async login(loginDto) {
        const user = await this.authRepository.findByEmail(loginDto.email);
        if (!user) {
            throw new http_error_1.HttpError(401, "Invalid credentials");
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password.trim(), user.password);
        if (!isPasswordValid) {
            throw new http_error_1.HttpError(401, "Invalid credentials");
        }
        const token = (0, jwt_1.generateToken)({
            id: user._id,
            email: user.email,
            role: user.role,
            tokenVersion: user.tokenVersion,
        });
        return {
            userData: user,
            token,
        };
    }
    async getProfile(userId) {
        const user = await this.authRepository.findById(userId);
        if (!user) {
            throw new http_error_1.HttpError(404, "User not found");
        }
        return user;
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.authRepository.findById(userId.toString());
        if (!user) {
            throw new http_error_1.HttpError(404, "User not found");
        }
        // check both current and new password are not the same
        if (currentPassword.toString() === newPassword.toString()) {
            throw new http_error_1.HttpError(400, "Please provide a different password, you cannot reuse the current password");
        }
        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordMatch) {
            throw new http_error_1.HttpError(400, "Current password is incorrect");
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        return await this.authRepository.updateUser(userId.toString(), {
            password: hashedNewPassword,
            tokenVersion: user.tokenVersion + 1,
        });
    }
    async forgotPassoword(email, origin) {
        const user = await this.authRepository.findByEmail(email);
        console.log("User found for forgot password:", user);
        if (!user) {
            throw new http_error_1.HttpError(404, "User not found");
        }
        // generate a reset token and send email to user with the reset link
        const rawToken = crypto_1.default.randomBytes(32).toString("hex");
        const { hashedToken } = (0, jwt_1.hashedTokenGenerator)(rawToken);
        await this.authRepository.updateUser(user._id.toString(), {
            passwordResetToken: hashedToken,
            passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000),
        });
        return await this.emailService.sendResetPasswordEmail(user.email, rawToken, origin);
    }
    async resetPassword(email, token, newPassword) {
        const { hashedToken } = (0, jwt_1.hashedTokenGenerator)(token);
        const user = await this.authRepository.findOne({
            email,
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: new Date() },
        });
        if (!user) {
            throw new http_error_1.HttpError(400, "Invalid or expired reset token");
        }
        const isPasswordMatchToOldOne = await bcrypt.compare(newPassword, user.password);
        if (isPasswordMatchToOldOne) {
            throw new http_error_1.HttpError(400, "Please provide a different password, you cannot reuse the old password");
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await this.authRepository.updateUser(user._id.toString(), {
            password: hashedNewPassword,
            passwordResetToken: null,
            passwordResetExpires: null,
            tokenVersion: user.tokenVersion + 1,
        });
        return { message: "Password reset successful" };
    }
    async logout(userId) {
        const user = await this.authRepository.findById(userId.toString());
        if (!user) {
            throw new http_error_1.HttpError(404, "User not found");
        }
        return await this.authRepository.updateUser(userId.toString(), {
            tokenVersion: user.tokenVersion + 1,
        });
    }
    async fetchUsers(query) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const search = query.search;
        const users = await this.authRepository.findMany({
            page: query.page,
            limit: query.limit,
            search,
        });
        let totalUsers;
        totalUsers = await this.authRepository.totalUsers({
            search: query.search,
            startDate: query.startDate,
            endDate: query.endDate,
        });
        return {
            users,
            pagination: {
                totalPages: Math.ceil(totalUsers / limit),
                currentPage: page,
                totalUsers,
            },
        };
    }
}
exports.AuthService = AuthService;
