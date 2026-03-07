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
exports.OrderModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const order_enum_1 = require("../../../../../../common/enums/order.enum");
const OrderItemSchema = new mongoose_1.Schema({
    sku: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, trim: true, default: null },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    taxPercent: { type: Number, default: 0, min: 0 },
}, { _id: false });
const ConsigneeSchema = new mongoose_1.Schema({
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
        enum: Object.values(order_enum_1.addressType),
        default: order_enum_1.addressType.OTHER,
    },
}, { _id: false });
const OrderSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
        default: order_enum_1.orderStatus.PENDING,
        enum: Object.values(order_enum_1.orderStatus),
        index: true,
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: Object.values(order_enum_1.paymentMethods),
    },
    expressType: {
        type: String,
        required: true,
        enum: Object.values(order_enum_1.expressTypes),
    },
    invoiceNumber: { type: String, required: true, trim: true },
    pickAddressId: { type: String, required: true, trim: true },
    returnAddressId: { type: String, trim: true, default: null },
    consignee: { type: ConsigneeSchema, required: true },
    items: {
        type: [OrderItemSchema],
        required: true,
        validate: {
            validator: (value) => value.length > 0,
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "ParcelXRequestLog",
        default: null,
        index: true,
    },
    parcelxResponseRefId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "ParcelXResponseLog",
        default: null,
        index: true,
    },
    requestSnapshot: { type: mongoose_1.Schema.Types.Mixed, required: true },
}, { timestamps: true, strict: false });
OrderSchema.index({ userId: 1, clientOrderId: 1 }, {
    unique: true,
    partialFilterExpression: { clientOrderId: { $type: "string" } },
});
exports.OrderModel = mongoose_1.default.model("Order", OrderSchema);
