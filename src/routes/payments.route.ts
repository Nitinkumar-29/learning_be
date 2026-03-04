import express from "express";
import { authModule } from "../modules/auth/auth.module";
import { PaymentGatewayModule } from "../modules/payments/payment-provider.module";
import { validate } from "../common/validator";
import { paymentOrderSchema } from "../modules/payments/infrastructure/persistence/document/types/payment-order.types";
const router = express.Router();
const { authMiddleware } = authModule;
const { paymentController } = PaymentGatewayModule;

router.post(
  "/order",
  authMiddleware.protect,
  validate(paymentOrderSchema),
  paymentController.createOrder,
);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.prcoessWebhook,
);

router.post(
  "/verify-payment",
  authMiddleware.protect,
  paymentController.verifyPayment,
);

export const paymentRoutes = router;
