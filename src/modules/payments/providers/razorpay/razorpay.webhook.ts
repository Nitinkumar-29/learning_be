import { paymentCapturedHandlerEvent } from "./events/payment.captured.event";

export const razorpayWebhookEvents: Record<string, Function> = {
  "payment.captured": paymentCapturedHandlerEvent,
  "order.paid": paymentCapturedHandlerEvent,
};
