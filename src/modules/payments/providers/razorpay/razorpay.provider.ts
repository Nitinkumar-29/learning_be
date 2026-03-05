import { HttpError } from "../../../../common/errors/http.error";
import { env } from "../../../../config/env";
import { razorpay } from "../../../../config/paymentProviders/razorpay.provider.config";
import {
  PaymentProvider,
  ProviderCreateOrderInput,
} from "../../interfaces/payment-provider.interface";
import { razorpayWebhookEvents } from "./razorpay.webhook";
import crypto from "crypto";

export class RazorpayProvider implements PaymentProvider {
  private razorpayInstance = razorpay;

  async createOrder(payload: ProviderCreateOrderInput): Promise<any> {
    try {
      return await this.razorpayInstance.orders.create({
        amount: payload.amountInPaise,
        currency: payload.currency,
        receipt: payload.receipt,
        payment_capture: true,
      });
    } catch (error: any) {
      const statusCode =
        typeof error?.statusCode === "number" ? error.statusCode : 502;
      const message =
        error?.error?.description ||
        error?.error?.reason ||
        error?.message ||
        "Razorpay order creation failed";
      throw new HttpError(statusCode, String(message));
    }
  }

  async processWebhook(req: any): Promise<any> {
    // check secret
    const secret = env.paymentProvider.paymentProviderWebhookSecret;
    if (!secret) {
      throw new HttpError(500, "Webhook not configured");
    }
    const requestSignature = req.headers["x-razorpay-signature"];
    const rawBody = req.body;

    const dataToSign = Buffer.isBuffer(rawBody)
      ? rawBody
      : Buffer.from(JSON.stringify(rawBody));

    // verify signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(dataToSign)
      .digest("hex");
    if (requestSignature !== expectedSignature) {
      throw new HttpError(400, "Invalid Signature");
    }

    // extract event and payload
    const { event, payload } = JSON.parse(dataToSign.toString("utf-8"));
    console.log(event, payload, "webhook-response-data");
    const handler = razorpayWebhookEvents[event];
    if (!handler) {
      return null;
    }
    // call event handler
    return handler(payload);
  }

  async fetchPaymentStatus(payload: any): Promise<any> {
    return;
  }
}
