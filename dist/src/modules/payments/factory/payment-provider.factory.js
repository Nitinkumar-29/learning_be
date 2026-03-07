"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentProviderFactory = void 0;
const payment_gateway_enum_1 = require("../../../common/enums/payment-gateway.enum");
const http_error_1 = require("../../../common/errors/http.error");
const razorpay_provider_1 = require("../providers/razorpay/razorpay.provider");
class PaymentProviderFactory {
    static getProvider(type) {
        switch (type) {
            case payment_gateway_enum_1.paymentProviderEnums.RAZORPAY:
                return new razorpay_provider_1.RazorpayProvider();
            default:
                throw new http_error_1.HttpError(400, "Unsupported provider");
        }
    }
    // get provider from webhook
    static getProviderFromWebhook(headers) {
        if (headers["x-razorpay-signature"]) {
            return new razorpay_provider_1.RazorpayProvider();
        }
        if (headers["z-payu-signature"]) {
        }
        throw new http_error_1.HttpError(400, "Unknown webhook provider");
    }
}
exports.PaymentProviderFactory = PaymentProviderFactory;
