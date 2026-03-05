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
  const transactionId =
    payload.transactionId != null ? String(payload.transactionId) : null;

  // BullMQ custom jobId cannot contain ":".
  const jobId = transactionId
    ? `${refId}_${operation}_${stage}_${transactionId}`
    : `${refId}_${operation}_${stage}`;

  await paymentLogQueue.add(jobName, data, { jobId });
};

export const paymentLogQueueJobs = paymentLogJobNames;
