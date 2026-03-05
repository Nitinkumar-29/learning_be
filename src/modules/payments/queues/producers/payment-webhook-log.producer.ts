import {
  paymentWebhookLogJobNames,
  paymentWebhookLogQueueName,
} from "../constants/payment-webhook-log.queue.constants";
import { createPaymentQueue } from "../queue.factory";
import { PaymentWebhookLogJobData } from "../types/payment-webhook-log-job.types";

export const paymentWebhookLogQueue =
  createPaymentQueue<PaymentWebhookLogJobData>(paymentWebhookLogQueueName);

export const enqueuePaymentWebhookLogJob = async (
  data: PaymentWebhookLogJobData,
): Promise<void> => {
  const { jobName } = data;

  let jobId: string | undefined;
  if (jobName === paymentWebhookLogJobNames.UPSERT) {
    const eventId = data.payload.eventId;
    if (eventId) {
      jobId = `${data.payload.provider}:${eventId}:${jobName}`;
    }
  }

  if (jobName === paymentWebhookLogJobNames.MARK_FAILED) {
    const eventId = data.payload.eventId;
    if (eventId) {
      jobId = `${data.payload.provider}:${eventId}:${jobName}`;
    }
  }

  await paymentWebhookLogQueue.add(jobName, data, jobId ? { jobId } : undefined);
};

export const paymentWebhookLogQueueJobs = paymentWebhookLogJobNames;

