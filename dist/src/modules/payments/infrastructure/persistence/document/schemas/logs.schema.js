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
exports.PaymentLogsModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const payment_gateway_enum_1 = require("../../../../../../common/enums/payment-gateway.enum");
const PaymentLogsSchema = new mongoose_1.Schema({
    refId: {
        type: String,
        required: true,
    },
    entityType: {
        type: String,
        required: true,
        enum: Object.values(payment_gateway_enum_1.paymentEntityTypeEnums),
    },
    event: {
        type: String,
        required: true,
        enum: Object.values(payment_gateway_enum_1.paymentEventEnums),
    },
    transactionId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Transactions",
        required: false,
        default: null,
    },
    orderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "PaymentOrder",
        required: false,
        default: null,
    },
    operation: {
        type: String,
        required: true,
        enum: Object.values(payment_gateway_enum_1.paymentLogOperationEnums),
    },
    stage: {
        type: String,
        required: true,
        enum: Object.values(payment_gateway_enum_1.paymentLogStageEnums),
    },
    requestPayload: {
        type: mongoose_1.default.Schema.Types.Mixed,
        required: false,
        default: null,
    },
    responsePayload: {
        type: mongoose_1.default.Schema.Types.Mixed,
        required: false,
        default: null,
    },
    provider: {
        type: String,
        required: true,
        enum: Object.values(payment_gateway_enum_1.paymentProviderEnums),
    },
    providerOrderId: {
        type: String,
        required: false,
        default: null,
    },
    status: {
        type: String,
        required: true,
        default: payment_gateway_enum_1.paymentLogStatusEnums.PENDING,
        enum: Object.values(payment_gateway_enum_1.paymentLogStatusEnums),
    },
    errorCode: {
        type: String,
        default: null,
    },
    errorReason: {
        type: String,
        default: null,
    },
    metadata: {
        type: mongoose_1.Schema.Types.Mixed,
        default: null,
    },
}, { timestamps: true });
PaymentLogsSchema.index({ refId: 1 });
PaymentLogsSchema.index({ refId: 1, operation: 1 }, { unique: true });
PaymentLogsSchema.index({ event: 1 });
PaymentLogsSchema.index({ orderId: 1 });
PaymentLogsSchema.index({ transactionId: 1 });
PaymentLogsSchema.index({ createdAt: -1 });
PaymentLogsSchema.index({ refId: 1, createdAt: 1 });
exports.PaymentLogsModel = mongoose_1.default.model("PaymentLogs", PaymentLogsSchema);
