import { PaymentWebhookResult } from "../../interfaces/payment-webhook-result.interface";
import { paymentWebhookLogJobNames } from "../constants/payment-webhook-log.queue.constants";

export type PaymentWebhookLogJobData =
  | {
      jobName: typeof paymentWebhookLogJobNames.UPSERT;
      payload: PaymentWebhookResult;
    }
  | {
      jobName: typeof paymentWebhookLogJobNames.MARK_FAILED;
      payload: {
        provider: string;
        eventId: string | null;
        errorMessage: string;
        rawPayload?: unknown;
        event?: string;
      };
    };

