"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentLogQueueJobs = exports.enqueuePaymentLogJob = exports.paymentLogQueue = void 0;
const payment_log_queue_constants_1 = require("../constants/payment-log.queue.constants");
const queue_factory_1 = require("../queue.factory");
exports.paymentLogQueue = (0, queue_factory_1.createPaymentQueue)(payment_log_queue_constants_1.paymentLogQueueName);
const enqueuePaymentLogJob = async (data) => {
    const { jobName, payload } = data;
    const refId = payload.refId;
    const operation = payload.operation;
    const stage = payload.stage;
    const transactionId = payload.transactionId != null ? String(payload.transactionId) : null;
    // BullMQ custom jobId cannot contain ":".
    const jobId = transactionId
        ? `${refId}_${operation}_${stage}_${transactionId}`
        : `${refId}_${operation}_${stage}`;
    await exports.paymentLogQueue.add(jobName, data, { jobId });
};
exports.enqueuePaymentLogJob = enqueuePaymentLogJob;
exports.paymentLogQueueJobs = payment_log_queue_constants_1.paymentLogJobNames;
