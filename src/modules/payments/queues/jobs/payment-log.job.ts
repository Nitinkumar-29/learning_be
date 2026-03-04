import { Job } from "bullmq";
import { PaymentLogsDocumentRepository } from "../../infrastructure/persistence/document/repositories/payment-logs.repository";
import { PaymentLogService } from "../../services/payment.log.service";
import { paymentLogJobNames } from "../constants/payment-log.queue.constants";
import { PaymentLogJobData } from "../types/payment-log-job.types";

const paymentLogsRepository = new PaymentLogsDocumentRepository();
const paymentLogService = new PaymentLogService(paymentLogsRepository);

export const processPaymentLogJob = async (job: Job<PaymentLogJobData>) => {
  const { jobName, payload } = job.data;

  switch (jobName) {
    case paymentLogJobNames.CREATE_ORDER_REQUEST:
      return paymentLogService.logCreateOrderRequest(payload);

    case paymentLogJobNames.CREATE_ORDER_RESPONSE:
      return paymentLogService.logCreateOrderResponse(payload);

    case paymentLogJobNames.CREATE_TXN_REQUEST:
      return paymentLogService.logCreateTxnRequest(payload);

    case paymentLogJobNames.CREATE_TXN_RESPONSE:
      return paymentLogService.logCreateTxnResponse(payload);

    default:
      throw new Error(`Unsupported payment log job: ${jobName}`);
  }
};

