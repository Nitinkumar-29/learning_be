"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentOrderModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const payment_gateway_enum_1 = require("../../../../../../common/enums/payment-gateway.enum");
const PaymentOrderSchema = new mongoose_1.Schema({
    userId: {
        ref: "User",
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    refId: {
        type: String,
        required: true,
        unique: true,
    },
    amountInPaise: {
        type: Number,
        required: true,
    },
    provider: {
        type: String,
        required: true,
        enum: Object.values(payment_gateway_enum_1.paymentProviderEnums),
    },
    paymentMode: {
        type: String,
        required: false,
        default: null,
        enum: Object.values(payment_gateway_enum_1.paymentModeEnums),
    },
    orderStatus: {
        type: String,
        required: false,
        default: payment_gateway_enum_1.paymentOrderStatusEnums.ORDER_INITIATED,
        enum: Object.values(payment_gateway_enum_1.paymentOrderStatusEnums),
    },
    promoCode: {
        type: String,
        required: false,
        default: null,
    },
    fee: {
        type: Number,
        required: false,
        default: 0,
    },
    tax: {
        type: Number,
        required: false,
        default: 0,
    },
    orderDetails: {
        type: mongoose_1.default.Schema.Types.Mixed,
        required: false,
    },
    // payment gateway order_id
    providerOrderId: {
        type: String,
        default: null,
        required: false,
    },
    paymentCompletedAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true });
PaymentOrderSchema.index({ providerOrderId: 1 });
PaymentOrderSchema.index({ userId: 1, createdAt: -1 });
exports.PaymentOrderModel = mongoose_1.default.model("PaymentOrder", PaymentOrderSchema);
