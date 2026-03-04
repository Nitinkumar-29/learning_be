import { paymentEventEnums } from "../../../../../common/enums/payment-gateway.enum";

export interface PaymentCapturedHandler {
  providerOrderId: string;
  paymentId: string;
  amount: number;
  currency: string;
  status: paymentEventEnums;
  rawPayload: object;
}
