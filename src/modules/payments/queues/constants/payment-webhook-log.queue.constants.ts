export const paymentWebhookLogQueueName = "payment-webhook-logs-queue";

export const paymentWebhookLogJobNames = {
  UPSERT: "payment-webhook-log.upsert",
  MARK_FAILED: "payment-webhook-log.mark-failed",
} as const;

