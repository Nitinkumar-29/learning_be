import mongoose, { Schema } from "mongoose";
import {
  paymentModeEnums,
  paymentProviderEnums,
  paymentTransactionStatusEnums,
} from "../../../../../../common/enums/payment-gateway.enum";

const TransactionSchema = new Schema(
  {
    refId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "PaymentOrder",
      required: true,
      index: true,
    },
    amountInPaise: {
      type: Number,
      required: true,
    },
    paymentMode: {
      type: String,
      required: true,
      enum: Object.values(paymentModeEnums),
    },
    provider: {
      type: String,
      required: true,
      enum: Object.values(paymentProviderEnums),
    },
    providerPaymentId: {
      type: String,
      sparse: true,
      unique: true,
      default: null,
    },
    status: {
      type: String,
      required: true,
      default: paymentTransactionStatusEnums.PAYMENT_PENDING,
      enum: Object.values(paymentTransactionStatusEnums),
    },
    paymentCompletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

TransactionSchema.index({ providerPaymentId: 1 });
TransactionSchema.index({ orderId: 1, createdAt: -1 });

export const TransactionModel = mongoose.model(
  "Transaction",
  TransactionSchema,
);
