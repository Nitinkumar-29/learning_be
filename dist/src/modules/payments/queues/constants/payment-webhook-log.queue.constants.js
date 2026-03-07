"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentWebhookLogJobNames = exports.paymentWebhookLogQueueName = void 0;
exports.paymentWebhookLogQueueName = "payment-webhook-logs-queue";
exports.paymentWebhookLogJobNames = {
    UPSERT: "payment-webhook-log.upsert",
    MARK_FAILED: "payment-webhook-log.mark-failed",
};
