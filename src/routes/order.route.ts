import express from "express";
const router = express.Router();
import { orderModule } from "../modules/orders/order.module";
import { authModule } from "../modules/auth/auth.module";
import { validate } from "../common/validator";
import { createOrderSchema } from "../modules/orders/infrastructure/persistence/document/types/order.type";

const { orderController } = orderModule;
const { authMiddleware } = authModule;

router.post(
  "/create",
  authMiddleware.protect,
  validate(createOrderSchema),
  orderController.createOrder,
);

router.post(
  "/cancel",
  authMiddleware.protect,
  orderController.cancelOrder,
);

export const orderRouter = router;
