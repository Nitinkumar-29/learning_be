"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentLogJobNames = exports.paymentLogQueueName = void 0;
exports.paymentLogQueueName = "payment-logs-queue";
exports.paymentLogJobNames = {
    CREATE_ORDER_REQUEST: "payment-log.create-order-request",
    CREATE_ORDER_RESPONSE: "payment-log.create-order-response",
    CREATE_TXN_REQUEST: "payment-log.create-transaction-request",
    CREATE_TXN_RESPONSE: "payment-log.create-transaction-response",
};
