"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderModule = void 0;
const order_controller_1 = require("./controllers/order.controller");
const order_document_repository_1 = require("./infrastructure/persistence/document/repositories/order-document.repository");
const order_service_1 = require("./services/order.service");
const orderRepository = new order_document_repository_1.OrderDocumentRepository();
const orderService = new order_service_1.OrderService(orderRepository);
const orderController = new order_controller_1.OrderController(orderService);
exports.orderModule = {
    orderService,
    orderController,
};
