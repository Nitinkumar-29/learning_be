import mongoose, { Schema } from "mongoose";
import {
  paymentEntityTypeEnums,
  paymentEventEnums,
  paymentLogOperationEnums,
  paymentLogStageEnums,
  paymentLogStatusEnums,
  paymentProviderEnums,
} from "../../../../../../common/enums/payment-gateway.enum";

const PaymentLogsSchema = new Schema(
  {
    refId: {
      type: String,
      required: true,
    },
    entityType: {
      type: String,
      required: true,
      enum: Object.values(paymentEntityTypeEnums),
    },
    event: {
      type: String,
      required: true,
      enum: Object.values(paymentEventEnums),
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transactions",
      required: false,
      default: null,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentOrder",
      required: false,
      default: null,
    },
    operation: {
      type: String,
      required: true,
      enum: Object.values(paymentLogOperationEnums),
    },
    stage: {
      type: String,
      required: true,
      enum: Object.values(paymentLogStageEnums),
    },
    requestPayload: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
      default: null,
    },
    responsePayload: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
      default: null,
    },
    provider: {
      type: String,
      required: true,
      enum: Object.values(paymentProviderEnums),
    },
    providerOrderId: {
      type: String,
      required: false,
      default: null,
    },
    status: {
      type: String,
      required: true,
      default: paymentLogStatusEnums.PENDING,
      enum: Object.values(paymentLogStatusEnums),
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
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true },
);

PaymentLogsSchema.index({ refId: 1 });
PaymentLogsSchema.index({ refId: 1, operation: 1 }, { unique: true });
PaymentLogsSchema.index({ event: 1 });
PaymentLogsSchema.index({ orderId: 1 });
PaymentLogsSchema.index({ transactionId: 1 });
PaymentLogsSchema.index({ createdAt: -1 });
PaymentLogsSchema.index({ refId: 1, createdAt: 1 });

export const PaymentLogsModel = mongoose.model(
  "PaymentLogs",
  PaymentLogsSchema,
);
