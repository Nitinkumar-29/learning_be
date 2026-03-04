import {
  paymentLogJobNames,
  paymentLogQueueName,
} from "../constants/payment-log.queue.constants";
import { createPaymentQueue } from "../queue.factory";
import { PaymentLogJobData } from "../types/payment-log-job.types";

export const paymentLogQueue = createPaymentQueue<PaymentLogJobData>(
  paymentLogQueueName,
);

export const enqueuePaymentLogJob = async (
  data: PaymentLogJobData,
): Promise<void> => {
  const { jobName, payload } = data;
  const refId = payload.refId;
  const operation = payload.operation;
  const stage = payload.stage;

  // dedupe repeated submits for the same lifecycle stage
  const jobId = `${refId}:${operation}:${stage}`;

  await paymentLogQueue.add(jobName, data, { jobId });
};

export const paymentLogQueueJobs = paymentLogJobNames;

