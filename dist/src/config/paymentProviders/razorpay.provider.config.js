"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.razorpay = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const env_1 = require("../env");
const http_error_1 = require("../../common/errors/http.error");
// credentials
const razorpayKeyId = env_1.env.paymentProvider.paymentProviderKeyId;
const razorpayKeySecret = env_1.env.paymentProvider.paymentProviderKeySecret;
if (!razorpayKeyId || !razorpayKeySecret) {
    throw new http_error_1.HttpError(500, "Razorpay initialization failed");
}
const razorpay = new razorpay_1.default({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
});
exports.razorpay = razorpay;
