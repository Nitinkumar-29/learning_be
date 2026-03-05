import { RazorpayWebhookEventResult } from "../types/events.types";

export async function paymentCapturedHandlerEvent(
  payload: any,
): Promise<RazorpayWebhookEventResult> {
  const payment = payload?.payment?.entity;
  const order = payload?.order?.entity;

  return {
    eventState: payment ? "processed" : "ignored",
    refId: order?.receipt || payment?.notes?.refId || null,
    providerOrderId: payment?.order_id || order?.id || null,
    paymentId: payment?.id || null,
    paymentMode: payment?.method || null,
    status: payment?.status || order?.status || null,
    amountInPaise: payment?.amount ?? order?.amount ?? null,
    currency: payment?.currency || order?.currency || null,
    rawPayload: payload,
  };
}
