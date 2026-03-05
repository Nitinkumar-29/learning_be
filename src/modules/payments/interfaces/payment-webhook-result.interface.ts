import { paymentProviderEnums } from "../../../common/enums/payment-gateway.enum";

export type WebhookEventState = "received" | "ignored" | "processed" | "failed";

export interface PaymentWebhookResult {
  provider: paymentProviderEnums;
  event: string;
  eventId: string | null;
  eventState: WebhookEventState;
  refId: string | null;
  providerOrderId: string | null;
  paymentId: string | null;
  paymentMode: string | null;
  status: string | null;
  amountInPaise: number | null;
  currency: string | null;
  rawPayload: unknown;
}
