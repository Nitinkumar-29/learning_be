"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentTransactionDocumentRepository = void 0;
const transactions_schema_1 = require("../schemas/transactions.schema");
class PaymentTransactionDocumentRepository {
    async create(payload, session) {
        const [doc] = await transactions_schema_1.TransactionModel.create([payload], { session });
        return doc;
    }
    async fetchAll(payload) { }
    async findByGatewayPaymentId(id, session) {
        return await transactions_schema_1.TransactionModel.findOne({ providerPaymentId: id }).session(session ?? null);
    }
    async findById(payload) { }
    async findByPaymentOrderId(id) {
        return await transactions_schema_1.TransactionModel.find({ orderId: id }).sort({ createdAt: -1 });
    }
    async findOne(payload) { }
    async updateOne(payload) { }
}
exports.PaymentTransactionDocumentRepository = PaymentTransactionDocumentRepository;
