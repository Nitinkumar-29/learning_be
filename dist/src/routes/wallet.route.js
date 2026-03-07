"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletRoutes = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const wallet_module_1 = require("../modules/wallet/wallet.module");
const auth_module_1 = require("../modules/auth/auth.module");
const validator_1 = require("../common/validator");
const wallet_type_1 = require("../modules/wallet/infrastructure/persistence/document/types/wallet.type");
const { walletController } = wallet_module_1.walletModule;
const { authMiddleware } = auth_module_1.authModule;
router.post("/create", authMiddleware.protect, (0, validator_1.validate)(wallet_type_1.createWalletSchema), walletController.createWallet);
router.get("/details", authMiddleware.protect, walletController.getWallet);
router.put("/update", authMiddleware.protect, (0, validator_1.validate)(wallet_type_1.updateWalletSchema), walletController.updateWallet);
exports.walletRoutes = router;
