import { PaymentWebhookResult } from "../../../../interfaces/payment-webhook-result.interface";
import { PaymentWebhookLogsRepository } from "../../abstraction/payment-webhook-logs.repository";
import { WebhookLogsModel } from "../schemas/webhook-logs.schema";

export class PaymentWebhookLogsDocumentRepository
  implements PaymentWebhookLogsRepository
{
  async findProcessedByProviderEventId(
    provider: string,
    eventId: string,
  ): Promise<any> {
    return WebhookLogsModel.findOne({ provider, eventId, processed: true });
  }

  async upsertWebhookLog(payload: PaymentWebhookResult): Promise<any> {
    const key =
      payload.eventId != null
        ? { provider: payload.provider, eventId: payload.eventId }
        : null;

    if (!key) {
      return WebhookLogsModel.create({
        ...payload,
        processed: payload.eventState === "processed" || payload.eventState === "ignored",
        processedAt:
          payload.eventState === "processed" || payload.eventState === "ignored"
            ? new Date()
            : null,
      });
    }

    return WebhookLogsModel.findOneAndUpdate(
      key,
      {
        $set: {
          event: payload.event,
          eventState: payload.eventState,
          refId: payload.refId,
          providerOrderId: payload.providerOrderId,
          paymentId: payload.paymentId,
          status: payload.status,
          amountInPaise: payload.amountInPaise,
          currency: payload.currency,
          rawPayload: payload.rawPayload,
          processed: payload.eventState === "processed" || payload.eventState === "ignored",
          processedAt:
            payload.eventState === "processed" || payload.eventState === "ignored"
              ? new Date()
              : null,
        },
        $setOnInsert: {
          provider: payload.provider,
          eventId: payload.eventId,
        },
      },
      { upsert: true, returnDocument: "after" },
    );
  }

  async markWebhookFailed(
    provider: string,
    eventId: string | null,
    payload: { errorMessage: string; rawPayload?: unknown; event?: string },
  ): Promise<any> {
    if (!eventId) {
      return WebhookLogsModel.create({
        provider,
        event: payload.event || "unknown",
        eventId: null,
        eventState: "failed",
        processed: false,
        errorMessage: payload.errorMessage,
        rawPayload: payload.rawPayload ?? null,
      });
    }

    return WebhookLogsModel.findOneAndUpdate(
      { provider, eventId },
      {
        $set: {
          event: payload.event || "unknown",
          eventState: "failed",
          processed: false,
          errorMessage: payload.errorMessage,
          rawPayload: payload.rawPayload ?? null,
        },
        $setOnInsert: { provider, eventId },
      },
      { upsert: true, returnDocument: "after" },
    );
  }
}

