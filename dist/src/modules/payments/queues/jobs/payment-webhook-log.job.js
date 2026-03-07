"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPaymentWebhookLogJob = void 0;
const payment_webhook_logs_repository_1 = require("../../infrastructure/persistence/document/repositories/payment-webhook-logs.repository");
const payment_webhook_log_service_1 = require("../../services/payment-webhook-log.service");
const payment_webhook_log_queue_constants_1 = require("../constants/payment-webhook-log.queue.constants");
const paymentWebhookLogsRepository = new payment_webhook_logs_repository_1.PaymentWebhookLogsDocumentRepository();
const paymentWebhookLogService = new payment_webhook_log_service_1.PaymentWebhookLogService(paymentWebhookLogsRepository);
const processPaymentWebhookLogJob = async (job) => {
    const { jobName, payload } = job.data;
    switch (jobName) {
        case payment_webhook_log_queue_constants_1.paymentWebhookLogJobNames.UPSERT:
            return paymentWebhookLogService.upsertWebhookLog(payload);
        case payment_webhook_log_queue_constants_1.paymentWebhookLogJobNames.MARK_FAILED:
            return paymentWebhookLogService.markWebhookFailed(payload);
        default:
            throw new Error(`Unsupported payment webhook log job: ${jobName}`);
    }
};
exports.processPaymentWebhookLogJob = processPaymentWebhookLogJob;
