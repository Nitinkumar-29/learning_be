import { Worker } from "bullmq";
import redisClient from "../../../../config/redis.config";
import { paymentWebhookLogQueueName } from "../constants/payment-webhook-log.queue.constants";
import { processPaymentWebhookLogJob } from "../jobs/payment-webhook-log.job";
import { PaymentWebhookLogJobData } from "../types/payment-webhook-log-job.types";

export const paymentWebhookLogConsumer = (): Worker<PaymentWebhookLogJobData> => {
  return new Worker<PaymentWebhookLogJobData>(
    paymentWebhookLogQueueName,
    processPaymentWebhookLogJob,
    {
      connection: redisClient,
    },
  );
};

