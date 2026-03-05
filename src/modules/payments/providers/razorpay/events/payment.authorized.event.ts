import { RazorpayWebhookEventResult } from "../types/events.types";

export async function paymentAuthorizedHandlerEvent(
  payload: any,
): Promise<RazorpayWebhookEventResult> {
  const payment = payload?.payment?.entity;

  return {
    eventState: payment ? "processed" : "ignored",
    refId: payment?.notes?.refId || null,
    providerOrderId: payment?.order_id || null,
    paymentId: payment?.id || null,
    paymentMode: payment?.method || null,
    status: payment?.status || null,
    amountInPaise: payment?.amount ?? null,
    currency: payment?.currency || null,
    rawPayload: payload,
  };
}
