import express from "express";
import { AuthController } from "../modules/auth/auth.controller";
import { AuthService } from "../modules/auth/auth.service";
import { AuthDocumentRepository } from "../modules/auth/infrastructure/persistence/document/repositories/auth.repository";
import { validate } from "../common/validator";
import { loginSchema, registerSchema } from "../modules/auth/infrastructure/persistence/document/types/auth.types";
const router = express.Router();

const authRepository = new AuthDocumentRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

router.post("/login", validate(loginSchema), authController.login);
router.post("/register", validate(registerSchema), authController.registerUser);

export const authRouter = router;
