export const paymentLogQueueName = "payment-logs-queue";

export const paymentLogJobNames = {
  CREATE_ORDER_REQUEST: "payment-log.create-order-request",
  CREATE_ORDER_RESPONSE: "payment-log.create-order-response",
  CREATE_TXN_REQUEST: "payment-log.create-transaction-request",
  CREATE_TXN_RESPONSE: "payment-log.create-transaction-response",
} as const;

