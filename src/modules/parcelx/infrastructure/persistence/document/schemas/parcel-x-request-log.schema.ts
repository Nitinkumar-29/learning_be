import mongoose, { Schema } from "mongoose";

const ParcelXRequestLogSchema = new Schema(
  {
    provider: {
      type: String,
      required: true,
      default: "parcelx",
      enum: ["parcelx"],
      index: true,
    },
    operation: {
      type: String,
      required: true,
      enum: ["order", "warehouse", "ndr", "b2b"],
      index: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
      index: true,
    },
    idempotencyKey: { type: String, trim: true, default: null, index: true },
    requestPayload: { type: Schema.Types.Mixed, required: true },
    attempt: { type: Number, default: 1 },
    queuedAt: { type: Date, default: Date.now },
    sentAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const ParcelXRequestLogModel = mongoose.model(
  "ParcelXRequestLog",
  ParcelXRequestLogSchema,
);
