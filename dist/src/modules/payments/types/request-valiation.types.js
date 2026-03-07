"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyPaymentRequestDto = exports.verifyPaymentRequestPayloadDto = void 0;
const zod_1 = require("zod");
exports.verifyPaymentRequestPayloadDto = zod_1.z.object({
    orderId: zod_1.z.string().trim(),
    paymentId: zod_1.z.string().trim(),
    signature: zod_1.z.string().trim(),
});
exports.VerifyPaymentRequestDto = exports.verifyPaymentRequestPayloadDto;
