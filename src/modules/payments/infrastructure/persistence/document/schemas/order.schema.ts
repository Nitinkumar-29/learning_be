import mongoose, { Schema } from "mongoose";
import {
  paymentModeEnums,
  paymentOrderStatusEnums,
  paymentProviderEnums,
} from "../../../../../../common/enums/payment-gateway.enum";

const PaymentOrderSchema = new Schema(
  {
    userId: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
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
      enum: Object.values(paymentProviderEnums),
    },
    paymentMode: {
      type: String,
      required: false,
      default: null,
      enum: Object.values(paymentModeEnums),
    },
    orderStatus: {
      type: String,
      required: false,
      default: paymentOrderStatusEnums.ORDER_INITIATED,
      enum: Object.values(paymentOrderStatusEnums),
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
      type: mongoose.Schema.Types.Mixed,
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
  },
  { timestamps: true },
);

PaymentOrderSchema.index({ providerOrderId: 1 });
PaymentOrderSchema.index({ userId: 1, createdAt: -1 });

export const PaymentOrderModel = mongoose.model(
  "PaymentOrder",
  PaymentOrderSchema,
);
