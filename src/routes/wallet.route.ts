import express from "express";
const router = express.Router();
import { walletModule } from "../modules/wallet/wallet.module";
import { authModule } from "../modules/auth/auth.module";
import { validate } from "../common/validator";
import {
  createWalletSchema,
  updateWalletSchema,
} from "../modules/wallet/infrastructure/persistence/document/types/wallet.type";
const { walletController } = walletModule;
const { authMiddleware } = authModule;

router.post(
  "/create",
  authMiddleware.protect,
  validate(createWalletSchema),
  walletController.createWallet,
);
router.get("/details", authMiddleware.protect, walletController.getWallet);
router.put(
  "/update",
  authMiddleware.protect,
  validate(updateWalletSchema),
  walletController.updateWallet,
);

export const walletRouter = router;
