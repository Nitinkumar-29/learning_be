import express from "express";
import { validate } from "../common/validator";
import {
  loginSchema,
  registerSchema,
} from "../modules/auth/infrastructure/persistence/document/types/auth.types";
import { authModule } from "../modules/auth/auth.module";
import { userRole } from "../common/enums/auth.enum";
const router = express.Router();

const { authController, authMiddleware } = authModule;

router.post("/register", validate(registerSchema), authController.registerUser);
router.post("/login", validate(loginSchema), authController.login);
router.get("/profile", authMiddleware.protect, authController.getProfile);
router.post(
  "/change-password",
  authMiddleware.protect,
  authController.changePassword,
);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/logout", authMiddleware.protect, authController.logout);
router.get(
  "/fetchUsers",
  authMiddleware.authorize(userRole.ADMIN),
  authController.fetchUsers,
);

export const authRouter = router;
