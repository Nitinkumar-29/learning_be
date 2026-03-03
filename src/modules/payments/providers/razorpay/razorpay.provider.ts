import { razorpay } from "../../../../config/paymentProviders/razorpay.provider.config";
import {
  PaymentProvider,
  ProviderCreateOrderInput,
} from "../../interfaces/payment-provider.interface";

export class RazorpayProvider implements PaymentProvider {
  private razorpayInstance = razorpay;

  async createOrder(payload: ProviderCreateOrderInput): Promise<any> {
    return await this.razorpayInstance.orders.create({
      amount: payload.amountInPaise,
      currency: payload.currency,
      receipt: payload.receipt,
      payment_capture: true,
    });
  }

  async verifyWebhook(payload: any, signature: any): Promise<any> {
    return;
  }

  async fetchPaymentStatus(payload: any): Promise<any> {
    return;
  }
}
