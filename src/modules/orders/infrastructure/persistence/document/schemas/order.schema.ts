import mongoose, { Schema } from "mongoose";
import {
  addressType,
  expressTypes,
  orderStatus,
  paymentMethods,
} from "../../../../../../common/enums/order.enum";

const OrderItemSchema = new Schema(
  {
    sku: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, trim: true, default: null },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    taxPercent: { type: Number, default: 0, min: 0 },
  },
  { _id: false },
);

const ConsigneeSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: null },
    mobile: { type: String, required: true, trim: true },
    phone: { type: String, trim: true, default: null },
    pincode: { type: String, required: true, trim: true },
    address1: { type: String, required: true, trim: true },
    address2: { type: String, trim: true, default: null },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, default: "India" },
    addressType: {
      type: String,
      enum: Object.values(addressType),
      default: addressType.OTHER,
    },
  },
  { _id: false },
);

const OrderSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    clientOrderId: { type: String, trim: true, default: null, index: true },
    status: {
      type: String,
      required: true,
      default: orderStatus.PENDING,
      enum: Object.values(orderStatus),
      index: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: Object.values(paymentMethods),
    },
    expressType: {
      type: String,
      required: true,
      enum: Object.values(expressTypes),
    },
    invoiceNumber: { type: String, required: true, trim: true },
    pickAddressId: { type: String, required: true, trim: true },
    returnAddressId: { type: String, trim: true, default: null },
    consignee: { type: ConsigneeSchema, required: true },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (value: unknown[]) => value.length > 0,
        message: "Order must contain at least one product item",
      },
    },
    shipment: {
      width: { type: [Number], required: true },
      height: { type: [Number], required: true },
      length: { type: [Number], required: true },
      weight: { type: [Number], required: true },
      mps: { type: Number, default: 0 },
    },
    charges: {
      orderAmount: { type: Number, required: true, min: 0 },
      codAmount: { type: Number, default: 0, min: 0 },
      taxAmount: { type: Number, default: 0, min: 0 },
      extraCharges: { type: Number, default: 0, min: 0 },
      totalAmount: { type: Number, required: true, min: 0 },
    },
    providerSyncStatus: {
      type: String,
      enum: ["queued", "processing", "success", "failed"],
      default: "queued",
      index: true,
    },
    parcelxRequestRefId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParcelXRequestLog",
      default: null,
      index: true,
    },
    parcelxResponseRefId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParcelXResponseLog",
      default: null,
      index: true,
    },
    requestSnapshot: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true, strict: false },
);

OrderSchema.index(
  { userId: 1, clientOrderId: 1 },
  {
    unique: true,
    partialFilterExpression: { clientOrderId: { $type: "string" } },
  },
);

export const OrderModel = mongoose.model("Order", OrderSchema);
