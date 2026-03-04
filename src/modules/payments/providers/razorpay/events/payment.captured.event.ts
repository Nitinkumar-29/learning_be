import { paymentEventEnums } from "../../../../../common/enums/payment-gateway.enum";
import { PaymentCapturedHandler } from "../types/events.types";

export async function paymentCapturedHandlerEvent(
  payload: any,
): Promise<PaymentCapturedHandler | null> {
  console.log(payload, "payment captured event payload");
  const payment = payload?.payment?.entity;
  if (!payment) {
    return null;
  }

  return {
    providerOrderId: payment.order_id,
    paymentId: payment.id,
    amount: payment.amount,
    currency: payment.currency,
    status: paymentEventEnums.PAYMENT_SUCCESS,
    rawPayload: payload,
  };
}
