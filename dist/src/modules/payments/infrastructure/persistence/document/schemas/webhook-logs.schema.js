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
exports.WebhookLogsModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const payment_gateway_enum_1 = require("../../../../../../common/enums/payment-gateway.enum");
const WebhookLogsSchema = new mongoose_1.Schema({
    provider: {
        type: String,
        required: true,
        enum: Object.values(payment_gateway_enum_1.paymentProviderEnums),
    },
    event: {
        type: String,
        required: true,
    },
    eventId: {
        type: String,
        default: null,
    },
    eventState: {
        type: String,
        required: true,
        enum: ["received", "ignored", "processed", "failed"],
    },
    refId: {
        type: String,
        default: null,
    },
    providerOrderId: {
        type: String,
        default: null,
    },
    paymentId: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        default: null,
    },
    amountInPaise: {
        type: Number,
        default: null,
    },
    currency: {
        type: String,
        default: null,
    },
    rawPayload: {
        type: mongoose_1.Schema.Types.Mixed,
        default: null,
    },
    processed: {
        type: Boolean,
        default: false,
    },
    errorMessage: {
        type: String,
        default: null,
    },
    processedAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true });
WebhookLogsSchema.index({ provider: 1, event: 1, createdAt: -1 });
WebhookLogsSchema.index({ providerOrderId: 1, createdAt: -1 });
WebhookLogsSchema.index({ paymentId: 1, createdAt: -1 });
WebhookLogsSchema.index({ provider: 1, eventId: 1 }, {
    unique: true,
    partialFilterExpression: { eventId: { $type: "string" } },
});
exports.WebhookLogsModel = mongoose_1.default.model("PaymentWebhookLogs", WebhookLogsSchema);
