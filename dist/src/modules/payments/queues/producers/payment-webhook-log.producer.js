"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentWebhookLogQueueJobs = exports.enqueuePaymentWebhookLogJob = exports.paymentWebhookLogQueue = void 0;
const payment_webhook_log_queue_constants_1 = require("../constants/payment-webhook-log.queue.constants");
const queue_factory_1 = require("../queue.factory");
exports.paymentWebhookLogQueue = (0, queue_factory_1.createPaymentQueue)(payment_webhook_log_queue_constants_1.paymentWebhookLogQueueName);
const enqueuePaymentWebhookLogJob = async (data) => {
    const { jobName } = data;
    let jobId;
    if (jobName === payment_webhook_log_queue_constants_1.paymentWebhookLogJobNames.UPSERT) {
        const eventId = data.payload.eventId;
        if (eventId) {
            jobId = `${data.payload.provider}:${eventId}:${jobName}`;
        }
    }
    if (jobName === payment_webhook_log_queue_constants_1.paymentWebhookLogJobNames.MARK_FAILED) {
        const eventId = data.payload.eventId;
        if (eventId) {
            jobId = `${data.payload.provider}:${eventId}:${jobName}`;
        }
    }
    await exports.paymentWebhookLogQueue.add(jobName, data, jobId ? { jobId } : undefined);
};
exports.enqueuePaymentWebhookLogJob = enqueuePaymentWebhookLogJob;
exports.paymentWebhookLogQueueJobs = payment_webhook_log_queue_constants_1.paymentWebhookLogJobNames;
