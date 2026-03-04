import { Worker } from "bullmq";
import redisClient from "../../../../config/redis.config";
import { paymentLogQueueName } from "../constants/payment-log.queue.constants";
import { processPaymentLogJob } from "../jobs/payment-log.job";
import { PaymentLogJobData } from "../types/payment-log-job.types";

export const paymentLogConsumer = (): Worker<PaymentLogJobData> => {
  return new Worker<PaymentLogJobData>(paymentLogQueueName, processPaymentLogJob, {
    connection: redisClient,
  });
};

