import { paymentProviderEnums } from "../../../common/enums/payment-gateway.enum";
import { PaymentProvider } from "../interfaces/payment-provider.interface";
import { RazorpayProvider } from "../providers/razorpay/razorpay.provider";

export class PaymentProviderFactory {
  static getProvider(type: string): PaymentProvider {
    switch (type) {
      case paymentProviderEnums.RAZORPAY:
        return new RazorpayProvider();

      default:
        throw new Error("Unsupported provider");
    }
  }
}
