import { paymentCapturedHandlerEvent } from "./events/payment.captured.event";
import { paymentAuthorizedHandlerEvent } from "./events/payment.authorized.event";
import { RazorpayWebhookEventResult } from "./types/events.types";

export const razorpayWebhookEvents: Record<
  string,
  (payload: any) => Promise<RazorpayWebhookEventResult>
> = {
  "payment.authorized": paymentAuthorizedHandlerEvent,
  "payment.captured": paymentCapturedHandlerEvent,
  "order.paid": paymentCapturedHandlerEvent,
};
