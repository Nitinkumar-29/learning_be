"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentLogsDocumentRepository = void 0;
const logs_schema_1 = require("../schemas/logs.schema");
class PaymentLogsDocumentRepository {
    async create(payload) {
        return await logs_schema_1.PaymentLogsModel.create(payload);
    }
    async upsertByRefAndOperation({ refId, operation, payload, }) {
        const { refId: _payloadRefId, operation: _payloadOperation, ...safePayload } = payload ?? {};
        return await logs_schema_1.PaymentLogsModel.findOneAndUpdate({ refId, operation }, {
            $set: safePayload,
            $setOnInsert: { refId, operation },
        }, { returnDocument: "after", upsert: true });
    }
    async fetchAll(query) { }
    async findById(id) {
        return await logs_schema_1.PaymentLogsModel.findById(id);
    }
    async findMany(query) { }
    async findOne(_id) {
        return await logs_schema_1.PaymentLogsModel.findOne({ _id });
    }
    async findOneAndUpdateOne(id, payload) { }
}
exports.PaymentLogsDocumentRepository = PaymentLogsDocumentRepository;
