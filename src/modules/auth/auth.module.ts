import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthDocumentRepository } from "./infrastructure/persistence/document/repositories/auth-document.repository";
import { NodemailerProvider } from "../emails/providers/nodemailer.provider";
import { EmailService } from "../emails/email.service";
import { AuthMiddleware } from "../../common/middleware/auth.middleware";

const emailProvider = new NodemailerProvider();
const emailService = new EmailService(emailProvider);
const authRepository = new AuthDocumentRepository();
const authService = new AuthService(authRepository, emailService);
const authController = new AuthController(authService);
const authMiddleware = new AuthMiddleware(authRepository);

export const authModule = {
  authController,
  authMiddleware,
};
