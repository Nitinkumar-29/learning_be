"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentLogService = void 0;
const payment_logs_types_1 = require("../infrastructure/persistence/document/types/payment.logs.types");
class PaymentLogService {
    constructor(paymentLogsRepository) {
        this.paymentLogsRepository = paymentLogsRepository;
    }
    // create order log request
    async logCreateOrderRequest(data) {
        const parsed = payment_logs_types_1.createOrderRequestLogSchema.parse(data);
        console.log(parsed, "parsed---data-log-request");
        return await this.paymentLogsRepository.upsertByRefAndOperation({
            refId: parsed.refId,
            operation: parsed.operation,
            payload: parsed,
        });
    }
    // create order log response
    async logCreateOrderResponse(data) {
        const parsed = payment_logs_types_1.createOrderResponseLogSchema.parse(data);
        return await this.paymentLogsRepository.upsertByRefAndOperation({
            refId: parsed.refId,
            operation: parsed.operation,
            payload: parsed,
        });
    }
    // create txn log request
    async logCreateTxnRequest(data) {
        const parsed = payment_logs_types_1.createTransactionRequestLogSchema.parse(data);
        return await this.paymentLogsRepository.upsertByRefAndOperation({
            refId: parsed.refId,
            operation: parsed.operation,
            payload: parsed,
        });
    }
    // async txn log response
    async logCreateTxnResponse(data) {
        const parsed = payment_logs_types_1.createTransactionResponseLogSchema.parse(data);
        return await this.paymentLogsRepository.upsertByRefAndOperation({
            refId: parsed.refId,
            operation: parsed.operation,
            payload: parsed,
        });
    }
}
exports.PaymentLogService = PaymentLogService;
