"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.authService = authService;
        this.login = this.login.bind(this);
        this.registerUser = this.registerUser.bind(this);
        this.getProfile = this.getProfile.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.forgotPassword = this.forgotPassword.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
        this.logout = this.logout.bind(this);
        this.fetchUsers = this.fetchUsers.bind(this);
    }
    async login(req, res, next) {
        try {
            const loginPayload = req.body;
            const result = await this.authService.login(loginPayload);
            const loginResponse = {
                message: "User logged in successfully",
                success: true,
                data: result,
            };
            return res.status(200).json(loginResponse);
        }
        catch (error) {
            next(error);
        }
    }
    async registerUser(req, res, next) {
        try {
            const ReqBody = req.body;
            const result = await this.authService.registerUser(ReqBody);
            const registerResponse = {
                message: "User registered successfully",
                success: true,
                data: result,
            };
            res.json(registerResponse);
        }
        catch (error) {
            next(error);
        }
    }
    async getProfile(req, res, next) {
        try {
            const userId = req?.user?.id;
            const user = await this.authService.getProfile(userId);
            res.json({
                success: true,
                message: "User profile fetched successfully",
                user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async changePassword(req, res, next) {
        try {
            const userId = req?.user?.id;
            const { currentPassword, newPassword } = req.body;
            await this.authService.changePassword(userId, currentPassword, newPassword);
            res
                .status(200)
                .json({ message: "Password changed successfully", success: true });
        }
        catch (error) {
            next(error);
        }
    }
    async forgotPassword(req, res, next) {
        try {
            const { email, origin } = req.body;
            const result = await this.authService.forgotPassoword(email, origin);
            res.status(200).json({
                message: "Reset password link sent to your email",
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async resetPassword(req, res, next) {
        try {
            const { email, token, newPassword } = req.body;
            await this.authService.resetPassword(email, token, newPassword);
            res.status(200).json({
                message: "Password reset successfully",
                success: true,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            const userId = req?.user?.id;
            await this.authService.logout(userId);
            res.status(200).json({
                message: "User logged out successfully",
                success: true,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async fetchUsers(req, res, next) {
        try {
            const query = {
                page: req.query.page || 1,
                limit: req.query.limit || 10,
                search: req.query.search,
                startDate: req.query.startDate,
                endDate: req.query.endDate,
            };
            const users = await this.authService.fetchUsers(query);
            res.json({
                messsage: "Users fetched successfully",
                success: true,
                result: users,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
