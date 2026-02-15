import express from "express";
import { AuthController } from "../modules/auth/auth.controller";
import { AuthService } from "../modules/auth/auth.service";
import { AuthDocumentRepository } from "../modules/auth/infrastructure/persistence/document/repositories/auth.repository";
const router = express.Router();

const authRepository = new AuthDocumentRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

router.post("/login", authController.login);
router.post("/register", authController.registerUser);

export const authRouter = router;
