"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queuesRoutes = void 0;
const api_1 = require("@bull-board/api");
const bullMQAdapter_1 = require("@bull-board/api/bullMQAdapter");
const express_1 = require("@bull-board/express");
const express_2 = __importDefault(require("express"));
const order_producer_1 = require("../modules/parcelx/queues/order/order.producer");
const warehouse_producer_1 = require("../modules/parcelx/queues/warehouse/warehouse.producer");
const queues_1 = require("../modules/payments/queues");
const router = express_2.default.Router();
const serverAdapter = new express_1.ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");
(0, api_1.createBullBoard)({
    queues: [
        new bullMQAdapter_1.BullMQAdapter(order_producer_1.parcelXOrderQueue),
        new bullMQAdapter_1.BullMQAdapter(order_producer_1.parcelXOrderCancellationQueue),
        new bullMQAdapter_1.BullMQAdapter(warehouse_producer_1.ParcelXWarehouseQueue),
        new bullMQAdapter_1.BullMQAdapter(queues_1.paymentLogQueue),
        new bullMQAdapter_1.BullMQAdapter(queues_1.paymentWebhookLogQueue)
    ],
    serverAdapter,
});
router.use("/admin/queues", serverAdapter.getRouter());
exports.queuesRoutes = router;
