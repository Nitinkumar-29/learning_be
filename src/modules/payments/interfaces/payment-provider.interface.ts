import { PaymentWebhookResult } from "./payment-webhook-result.interface";

export interface ProviderCreateOrderInput {
  amountInPaise: number;
  receipt: string;
  currency: string;
}

export interface PaymentProvider {
  createOrder(payload: ProviderCreateOrderInput): Promise<any>;
  processWebhook(req: any): Promise<PaymentWebhookResult>;
  fetchPaymentStatus(payload: any): Promise<any>;
  // verifyWebhookSignature(payload: any): Promise<any>;
  verifyCheckoutSignature(payload: any): boolean;
}
