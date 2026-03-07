"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RazorpayProvider = void 0;
const http_error_1 = require("../../../../common/errors/http.error");
const env_1 = require("../../../../config/env");
const razorpay_provider_config_1 = require("../../../../config/paymentProviders/razorpay.provider.config");
const payment_gateway_enum_1 = require("../../../../common/enums/payment-gateway.enum");
const razorpay_webhook_1 = require("./razorpay.webhook");
const crypto_1 = __importDefault(require("crypto"));
class RazorpayProvider {
    constructor() {
        this.razorpayInstance = razorpay_provider_config_1.razorpay;
    }
    async createOrder(payload) {
        try {
            return await this.razorpayInstance.orders.create({
                amount: payload.amountInPaise,
                currency: payload.currency,
                receipt: payload.receipt,
                payment_capture: true,
            });
        }
        catch (error) {
            const statusCode = typeof error?.statusCode === "number" ? error.statusCode : 502;
            const message = error?.error?.description ||
                error?.error?.reason ||
                error?.message ||
                "Razorpay order creation failed";
            throw new http_error_1.HttpError(statusCode, String(message));
        }
    }
    async processWebhook(req) {
        // check secret
        const secret = env_1.env.paymentProvider.paymentProviderWebhookSecret;
        if (!secret) {
            throw new http_error_1.HttpError(500, "Webhook not configured");
        }
        const requestSignature = req.headers["x-razorpay-signature"];
        const rawBody = req.body;
        const dataToSign = Buffer.isBuffer(rawBody)
            ? rawBody
            : Buffer.from(JSON.stringify(rawBody));
        // verify signature
        const expectedSignature = crypto_1.default
            .createHmac("sha256", secret)
            .update(dataToSign)
            .digest("hex");
        if (requestSignature !== expectedSignature) {
            throw new http_error_1.HttpError(400, "Invalid Signature");
        }
        const eventIdHeader = req.headers["x-razorpay-event-id"];
        const eventId = typeof eventIdHeader === "string"
            ? eventIdHeader
            : Array.isArray(eventIdHeader)
                ? eventIdHeader[0]
                : null;
        // extract event and payload
        const { event, payload } = JSON.parse(dataToSign.toString("utf-8"));
        const handler = razorpay_webhook_1.razorpayWebhookEvents[event];
        if (!handler) {
            return {
                provider: payment_gateway_enum_1.paymentProviderEnums.RAZORPAY,
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
            provider: payment_gateway_enum_1.paymentProviderEnums.RAZORPAY,
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
    async fetchPaymentStatus(payload) {
        const paymentId = payload.paymentId;
        try {
            const status = await razorpay_provider_config_1.razorpay.payments.fetch(paymentId);
            console.log(status, "fetch-payment-status");
            return status;
        }
        catch (error) {
            throw new http_error_1.HttpError(404, `payment not found for paymentId ${paymentId}`);
        }
    }
    // implement checkout signatre verifyication method
    verifyCheckoutSignature(params) {
        const keySecret = env_1.env.paymentProvider.paymentProviderKeySecret;
        if (!keySecret) {
            throw new http_error_1.HttpError(400, "provider signature verification failed");
        }
        const { orderId, paymentId, signature } = params;
        console.log(orderId, paymentId, signature, "payload");
        const expectedSignature = crypto_1.default
            .createHmac("sha256", keySecret)
            .update(orderId + "|" + paymentId)
            .digest("hex");
        console.log(expectedSignature, "expected");
        console.log(signature, "request");
        return expectedSignature === signature;
    }
}
exports.RazorpayProvider = RazorpayProvider;
