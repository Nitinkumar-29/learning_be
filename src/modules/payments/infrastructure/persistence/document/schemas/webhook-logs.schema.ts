import mongoose, { Schema } from "mongoose";
import { paymentProviderEnums } from "../../../../../../common/enums/payment-gateway.enum";

const WebhookLogsSchema = new Schema(
  {
    provider: {
      type: String,
      required: true,
      enum: Object.values(paymentProviderEnums),
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
      type: Schema.Types.Mixed,
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
  },
  { timestamps: true },
);

WebhookLogsSchema.index({ provider: 1, event: 1, createdAt: -1 });
WebhookLogsSchema.index({ providerOrderId: 1, createdAt: -1 });
WebhookLogsSchema.index({ paymentId: 1, createdAt: -1 });
WebhookLogsSchema.index(
  { provider: 1, eventId: 1 },
  {
    unique: true,
    partialFilterExpression: { eventId: { $type: "string" } },
  },
);

export const WebhookLogsModel = mongoose.model("PaymentWebhookLogs", WebhookLogsSchema);

