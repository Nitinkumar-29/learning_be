import { Job } from "bullmq";
import { PaymentWebhookLogsDocumentRepository } from "../../infrastructure/persistence/document/repositories/payment-webhook-logs.repository";
import { PaymentWebhookLogService } from "../../services/payment-webhook-log.service";
import { paymentWebhookLogJobNames } from "../constants/payment-webhook-log.queue.constants";
import { PaymentWebhookLogJobData } from "../types/payment-webhook-log-job.types";

const paymentWebhookLogsRepository = new PaymentWebhookLogsDocumentRepository();
const paymentWebhookLogService = new PaymentWebhookLogService(
  paymentWebhookLogsRepository,
);

export const processPaymentWebhookLogJob = async (
  job: Job<PaymentWebhookLogJobData>,
) => {
  const { jobName, payload } = job.data;

  switch (jobName) {
    case paymentWebhookLogJobNames.UPSERT:
      return paymentWebhookLogService.upsertWebhookLog(payload);

    case paymentWebhookLogJobNames.MARK_FAILED:
      return paymentWebhookLogService.markWebhookFailed(payload);

    default:
      throw new Error(`Unsupported payment webhook log job: ${jobName}`);
  }
};

