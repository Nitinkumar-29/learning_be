import express from "express";
import { AuthController } from "../modules/auth/auth.controller";
import { AuthService } from "../modules/auth/auth.service";
import { AuthDocumentRepository } from "../modules/auth/infrastructure/persistence/document/repositories/auth.repository";
import { validate } from "../common/validator";
import {
  loginSchema,
  registerSchema,
} from "../modules/auth/infrastructure/persistence/document/types/auth.types";
import { AuthMiddleware } from "../common/middleware/auth.middleware";
import { NodemailerProvider } from "../modules/emails/providers/nodemailer.provider";
import { EmailService } from "../modules/emails/email.service";
const router = express.Router();

const emailProvider = new NodemailerProvider();
const emailService = new EmailService(emailProvider);
const authRepository = new AuthDocumentRepository();
const authService = new AuthService(authRepository, emailService);
const authController = new AuthController(authService);
const authMiddleware = new AuthMiddleware(authRepository);

router.post("/login", validate(loginSchema), authController.login);
router.post("/register", validate(registerSchema), authController.registerUser);
router.get("/profile", authMiddleware.protect, authController.getProfile);
router.post(
  "/change-password",
  authMiddleware.protect,
  authController.changePassword,
);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

export const authRouter = router;
