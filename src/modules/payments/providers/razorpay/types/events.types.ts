export interface RazorpayWebhookEventResult {
  eventState: "processed" | "ignored";
  refId: string | null;
  providerOrderId: string | null;
  paymentId: string | null;
  status: string | null;
  amountInPaise: number | null;
  currency: string | null;
  rawPayload: unknown;
}
