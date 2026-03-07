"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const reset_password_template_1 = require("./templates/reset-password.template");
class EmailService {
    constructor(emailProvider) {
        this.emailProvider = emailProvider;
    }
    async sendResetPasswordEmail(email, resetToken, requestOriginUrl) {
        try {
            const resetLink = `${requestOriginUrl}/reset-password?email=${email}&token=${resetToken}`;
            const html = (0, reset_password_template_1.resetPasswordTemplate)(resetLink);
            await this.emailProvider.sendMail({
                to: email,
                subject: "Password Reset Request",
                html,
            });
        }
        catch (error) {
            throw error;
        }
    }
}
exports.EmailService = EmailService;
