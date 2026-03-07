"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPaymentLogJob = void 0;
const payment_logs_repository_1 = require("../../infrastructure/persistence/document/repositories/payment-logs.repository");
const payment_log_service_1 = require("../../services/payment.log.service");
const payment_log_queue_constants_1 = require("../constants/payment-log.queue.constants");
const paymentLogsRepository = new payment_logs_repository_1.PaymentLogsDocumentRepository();
const paymentLogService = new payment_log_service_1.PaymentLogService(paymentLogsRepository);
const processPaymentLogJob = async (job) => {
    const { jobName, payload } = job.data;
    switch (jobName) {
        case payment_log_queue_constants_1.paymentLogJobNames.CREATE_ORDER_REQUEST:
            return paymentLogService.logCreateOrderRequest(payload);
        case payment_log_queue_constants_1.paymentLogJobNames.CREATE_ORDER_RESPONSE:
            return paymentLogService.logCreateOrderResponse(payload);
        case payment_log_queue_constants_1.paymentLogJobNames.CREATE_TXN_REQUEST:
            return paymentLogService.logCreateTxnRequest(payload);
        case payment_log_queue_constants_1.paymentLogJobNames.CREATE_TXN_RESPONSE:
            return paymentLogService.logCreateTxnResponse(payload);
        default:
            throw new Error(`Unsupported payment log job: ${jobName}`);
    }
};
exports.processPaymentLogJob = processPaymentLogJob;
