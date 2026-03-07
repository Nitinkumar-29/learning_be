import { HttpError } from "../../../../common/errors/http.error";
import { env } from "../../../../config/env";
import { razorpay } from "../../../../config/paymentProviders/razorpay.provider.config";
import {
  PaymentProvider,
  ProviderCreateOrderInput,
} from "../../interfaces/payment-provider.interface";
import { PaymentWebhookResult } from "../../interfaces/payment-webhook-result.interface";
import { paymentProviderEnums } from "../../../../common/enums/payment-gateway.enum";
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

  async processWebhook(req: any): Promise<PaymentWebhookResult> {
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

    const eventIdHeader = req.headers["x-razorpay-event-id"];
    const eventId =
      typeof eventIdHeader === "string"
        ? eventIdHeader
        : Array.isArray(eventIdHeader)
          ? eventIdHeader[0]
          : null;

    // extract event and payload
    const { event, payload } = JSON.parse(dataToSign.toString("utf-8"));

    const handler = razorpayWebhookEvents[event];
    if (!handler) {
      return {
        provider: paymentProviderEnums.RAZORPAY,
        event,
        eventId,
        eventState: "ignored",
        refId: null,
        providerOrderId: null,
        paymentId: null,
        paymentMode: null,
        status: null,
        amountInPaise: null,
        currency: null,
        rawPayload: payload,
      };
    }

    const normalized = await handler(payload);
    return {
      provider: paymentProviderEnums.RAZORPAY,
      event,
      eventId,
      eventState: normalized.eventState,
      refId: normalized.refId,
      providerOrderId: normalized.providerOrderId,
      paymentId: normalized.paymentId,
      paymentMode: normalized.paymentMode,
      status: normalized.status,
      amountInPaise: normalized.amountInPaise,
      currency: normalized.currency,
      rawPayload: normalized.rawPayload,
    };
  }

  async fetchPaymentStatus(payload: any): Promise<any> {
    const paymentId = payload.paymentId;
    try {
      const status = await razorpay.payments.fetch(paymentId);
      console.log(status,"fetch-payment-status");
      return status;
    } catch (error) {
      throw new HttpError(404, `payment not found for paymentId ${paymentId}`);
    }
  }

  // implement checkout signatre verifyication method
  verifyCheckoutSignature(params: {
    orderId: string;
    paymentId: string;
    signature: string;
    keySecret: string;
  }): boolean {
    const keySecret = env.paymentProvider.paymentProviderKeySecret;
    if (!keySecret) {
      throw new HttpError(400, "provider signature verification failed");
    }
    const { orderId, paymentId, signature } = params;
    console.log(orderId, paymentId, signature, "payload");

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(orderId + "|" + paymentId)
      .digest("hex");
    console.log(expectedSignature,"expected")
    console.log(signature,"request")
    return expectedSignature === signature;
  }
}
