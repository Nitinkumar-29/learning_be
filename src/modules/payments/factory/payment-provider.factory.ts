import { paymentProviderEnums } from "../../../common/enums/payment-gateway.enum";
import { HttpError } from "../../../common/errors/http.error";
import { PaymentProvider } from "../interfaces/payment-provider.interface";
import { RazorpayProvider } from "../providers/razorpay/razorpay.provider";

export class PaymentProviderFactory {
  static getProvider(type: paymentProviderEnums): PaymentProvider {
    switch (type) {
      case paymentProviderEnums.RAZORPAY:
        return new RazorpayProvider();

      default:
        throw new HttpError(400, "Unsupported provider");
    }
  }

  // get provider from webhook
  static getProviderFromWebhook(headers: any): PaymentProvider {
    if (headers["x-razorpay-signature"]) {
      return new RazorpayProvider();
    }

    if (headers["z-payu-signature"]) {
    }

    throw new HttpError(400, "Unknown webhook provider");
  }
}
