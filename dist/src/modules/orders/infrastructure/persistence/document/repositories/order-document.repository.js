"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderDocumentRepository = void 0;
const order_repository_1 = require("../../abstraction/order.repository");
const order_schema_1 = require("../schemas/order.schema");
class OrderDocumentRepository extends order_repository_1.OrderRepository {
    async create(orderData, session) {
        const [order] = await order_schema_1.OrderModel.create([orderData], { session });
        return order;
    }
    async findById(orderId, session) {
        return await order_schema_1.OrderModel.findById(orderId).session(session ?? null);
    }
    async findByUserAndClientOrderId(userId, clientOrderId, session) {
        return await order_schema_1.OrderModel.findOne({ userId, clientOrderId }).session(session ?? null);
    }
    async findByOrderNumber(orderNumber, session) {
        return await order_schema_1.OrderModel.findOne({ orderNumber }).session(session ?? null);
    }
    async updateOne(orderId, orderData, session) {
        return await order_schema_1.OrderModel.findByIdAndUpdate(orderId, orderData, {
            returnDocument: "after",
            session,
        });
    }
}
exports.OrderDocumentRepository = OrderDocumentRepository;
