"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authModule = void 0;
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const auth_document_repository_1 = require("./infrastructure/persistence/document/repositories/auth-document.repository");
const nodemailer_provider_1 = require("../emails/providers/nodemailer.provider");
const email_service_1 = require("../emails/email.service");
const auth_middleware_1 = require("../../common/middleware/auth.middleware");
const emailProvider = new nodemailer_provider_1.NodemailerProvider();
const emailService = new email_service_1.EmailService(emailProvider);
const authRepository = new auth_document_repository_1.AuthDocumentRepository();
const authService = new auth_service_1.AuthService(authRepository, emailService);
const authController = new auth_controller_1.AuthController(authService);
const authMiddleware = new auth_middleware_1.AuthMiddleware(authRepository);
exports.authModule = {
    authController,
    authMiddleware,
};
