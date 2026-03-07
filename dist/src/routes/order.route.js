"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const order_module_1 = require("../modules/orders/order.module");
const auth_module_1 = require("../modules/auth/auth.module");
const validator_1 = require("../common/validator");
const order_type_1 = require("../modules/orders/infrastructure/persistence/document/types/order.type");
const { orderController } = order_module_1.orderModule;
const { authMiddleware } = auth_module_1.authModule;
router.post("/create", authMiddleware.protect, (0, validator_1.validate)(order_type_1.createOrderSchema), orderController.createOrder);
router.post("/cancel", authMiddleware.protect, orderController.cancelOrder);
exports.orderRoutes = router;
