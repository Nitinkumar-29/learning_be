import mongoose, { Schema } from "mongoose";

const ParcelXResponseLogSchema = new Schema(
  {
    requestRefId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParcelXRequestLog",
      required: true,
      index: true,
    },
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
    statusCode: { type: Number, default: null },
    success: { type: Boolean, required: true, default: false, index: true },
    responsePayload: { type: Schema.Types.Mixed, required: true },
    errorCode: { type: String, trim: true, default: null },
    errorMessage: { type: String, trim: true, default: null },
    receivedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const ParcelXResponseLogModel = mongoose.model(
  "ParcelXResponseLog",
  ParcelXResponseLogSchema,
);
