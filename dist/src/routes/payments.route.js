"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_module_1 = require("../modules/auth/auth.module");
const payment_provider_module_1 = require("../modules/payments/payment-provider.module");
const validator_1 = require("../common/validator");
const payment_order_types_1 = require("../modules/payments/infrastructure/persistence/document/types/payment-order.types");
const request_valiation_types_1 = require("../modules/payments/types/request-valiation.types");
const router = express_1.default.Router();
const { authMiddleware } = auth_module_1.authModule;
const { paymentController } = payment_provider_module_1.PaymentGatewayModule;
router.post("/order", authMiddleware.protect, (0, validator_1.validate)(payment_order_types_1.paymentOrderSchema), paymentController.createOrder);
router.post("/webhook", express_1.default.raw({ type: "application/json" }), paymentController.prcoessWebhook);
router.post("/verify", authMiddleware.protect, (0, validator_1.validate)(request_valiation_types_1.VerifyPaymentRequestDto), paymentController.verifyPayment);
exports.paymentRoutes = router;
