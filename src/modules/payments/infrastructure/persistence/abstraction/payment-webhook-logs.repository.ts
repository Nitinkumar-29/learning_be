import { PaymentWebhookResult } from "../../../interfaces/payment-webhook-result.interface";

export abstract class PaymentWebhookLogsRepository {
  abstract findProcessedByProviderEventId(
    provider: string,
    eventId: string,
  ): Promise<any>;
  abstract upsertWebhookLog(payload: PaymentWebhookResult): Promise<any>;
  abstract markWebhookFailed(
    provider: string,
    eventId: string | null,
    payload: { errorMessage: string; rawPayload?: unknown; event?: string },
  ): Promise<any>;
}

