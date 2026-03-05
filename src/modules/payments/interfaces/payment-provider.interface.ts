export interface ProviderCreateOrderInput {
  amountInPaise: number;
  receipt: string;
  currency: string;
}

export interface PaymentProvider {
  createOrder(payload: ProviderCreateOrderInput): Promise<any>;
  processWebhook(req:any): Promise<any>;
  fetchPaymentStatus(payload: any): Promise<any>;
}
