"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordTemplate = void 0;
const resetPasswordTemplate = (resetLink) => {
    return `
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
        `;
};
exports.resetPasswordTemplate = resetPasswordTemplate;
