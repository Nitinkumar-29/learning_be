import { PaymentWebhookResult } from "../interfaces/payment-webhook-result.interface";
import { PaymentWebhookLogsRepository } from "../infrastructure/persistence/abstraction/payment-webhook-logs.repository";

export class PaymentWebhookLogService {
  constructor(
    private readonly paymentWebhookLogsRepository: PaymentWebhookLogsRepository,
  ) {}

  async isDuplicateEvent(provider: string, eventId: string | null): Promise<boolean> {
    if (!eventId) {
      return false;
    }
    const existing = await this.paymentWebhookLogsRepository.findProcessedByProviderEventId(
      provider,
      eventId,
    );
    return Boolean(existing);
  }

  async upsertWebhookLog(payload: PaymentWebhookResult): Promise<any> {
    return this.paymentWebhookLogsRepository.upsertWebhookLog(payload);
  }

  async markWebhookFailed({
    provider,
    eventId,
    errorMessage,
    rawPayload,
    event,
  }: {
    provider: string;
    eventId: string | null;
    errorMessage: string;
    rawPayload?: unknown;
    event?: string;
  }): Promise<any> {
    return this.paymentWebhookLogsRepository.markWebhookFailed(provider, eventId, {
      errorMessage,
      rawPayload,
      event,
    });
  }
}

