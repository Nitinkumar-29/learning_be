"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentLogConsumer = void 0;
const bullmq_1 = require("bullmq");
const redis_config_1 = require("../../../../config/redis.config");
const payment_log_queue_constants_1 = require("../constants/payment-log.queue.constants");
const payment_log_job_1 = require("../jobs/payment-log.job");
const paymentLogConsumer = () => {
    return new bullmq_1.Worker(payment_log_queue_constants_1.paymentLogQueueName, payment_log_job_1.processPaymentLogJob, {
        connection: (0, redis_config_1.createRedisConnection)(),
    });
};
exports.paymentLogConsumer = paymentLogConsumer;
