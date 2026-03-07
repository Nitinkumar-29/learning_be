"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentWebhookLogConsumer = void 0;
const bullmq_1 = require("bullmq");
const redis_config_1 = require("../../../../config/redis.config");
const payment_webhook_log_queue_constants_1 = require("../constants/payment-webhook-log.queue.constants");
const payment_webhook_log_job_1 = require("../jobs/payment-webhook-log.job");
const paymentWebhookLogConsumer = () => {
    return new bullmq_1.Worker(payment_webhook_log_queue_constants_1.paymentWebhookLogQueueName, payment_webhook_log_job_1.processPaymentWebhookLogJob, {
        connection: (0, redis_config_1.createRedisConnection)(),
    });
};
exports.paymentWebhookLogConsumer = paymentWebhookLogConsumer;
