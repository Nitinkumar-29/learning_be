"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentOrderDocumentRepository = void 0;
const order_schema_1 = require("../schemas/order.schema");
class PaymentOrderDocumentRepository {
    async create({ paymentOrder, userId, }) {
        // amountInPaise is already in smallest unit and should be persisted as-is
        const payload = {
            ...paymentOrder,
            amountInPaise: paymentOrder.amountInPaise,
            userId,
        };
        return (await order_schema_1.PaymentOrderModel.create(payload));
    }
    async fetchAll(payload) { }
    async findByGatewayOrderId(id, session) {
        return await order_schema_1.PaymentOrderModel.findOne({ providerOrderId: id }).session(session ?? null);
    }
    async findById(payload) { }
    async findOne(payload) { }
    async updateOne({ refId, payload, session, }) {
        // find order by refid for uniquenes and then update details
        return await order_schema_1.PaymentOrderModel.findOneAndUpdate({ refId }, { ...payload }, { returnDocument: "after", session });
    }
}
exports.PaymentOrderDocumentRepository = PaymentOrderDocumentRepository;
