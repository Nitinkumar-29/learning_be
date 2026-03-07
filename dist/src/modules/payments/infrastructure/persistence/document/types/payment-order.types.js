"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentOrderDto = exports.paymentOrderSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const payment_gateway_enum_1 = require("../../../../../../common/enums/payment-gateway.enum");
exports.paymentOrderSchema = zod_1.default.object({
    refId: zod_1.default.string().trim(),
    amountInPaise: zod_1.default
        .number()
        .int({ message: "Amount must be an integer in paise" })
        .positive({ message: "Amount must be greater than 0" }),
    provider: zod_1.default.enum(Object.values(payment_gateway_enum_1.paymentProviderEnums), {
        message: "Invalid provider",
    }),
    paymentMode: zod_1.default
        .enum(Object.values(payment_gateway_enum_1.paymentModeEnums), {
        message: "Invalid payment mode",
    })
        .optional(),
    promoCode: zod_1.default.string().trim().optional(),
});
exports.paymentOrderDto = exports.paymentOrderSchema;
