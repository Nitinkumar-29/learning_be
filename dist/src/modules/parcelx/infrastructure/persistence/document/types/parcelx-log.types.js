"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerParcelXWarehouseSchema = exports.createParcelXResponseLogSchema = exports.createParcelXRequestLogSchema = exports.parcelXOperationSchema = exports.parcelXProviderSchema = void 0;
const zod_1 = require("zod");
const objectIdStringSchema = zod_1.z
    .string()
    .trim()
    .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");
const objectIdLikeSchema = zod_1.z.preprocess((value) => {
    if (typeof value === "string") {
        return value;
    }
    if (value && typeof value === "object") {
        const maybeObjectId = value;
        if (typeof maybeObjectId.toString === "function") {
            return maybeObjectId.toString();
        }
    }
    return value;
}, objectIdStringSchema);
exports.parcelXProviderSchema = zod_1.z.literal("parcelx");
exports.parcelXOperationSchema = zod_1.z.enum([
    "order",
    "warehouse",
    "ndr",
    "b2b",
]);
exports.createParcelXRequestLogSchema = zod_1.z.object({
    provider: exports.parcelXProviderSchema.optional().default("parcelx"),
    operation: exports.parcelXOperationSchema,
    orderId: objectIdLikeSchema.optional().nullable(),
    idempotencyKey: zod_1.z.string().trim().optional().nullable(),
    requestPayload: zod_1.z.unknown(),
    attempt: zod_1.z.number().int().min(1).optional().default(1),
    queuedAt: zod_1.z
        .date()
        .optional()
        .default(() => new Date()),
    sentAt: zod_1.z.date().optional().nullable(),
});
exports.createParcelXResponseLogSchema = zod_1.z.object({
    requestRefId: objectIdLikeSchema,
    provider: exports.parcelXProviderSchema.optional().default("parcelx"),
    operation: exports.parcelXOperationSchema,
    orderId: objectIdLikeSchema.optional().nullable(),
    statusCode: zod_1.z.number().int().optional().nullable(),
    success: zod_1.z.boolean(),
    responsePayload: zod_1.z.unknown(),
    errorCode: zod_1.z.string().trim().optional().nullable(),
    errorMessage: zod_1.z.string().trim().optional().nullable(),
    receivedAt: zod_1.z
        .date()
        .optional()
        .default(() => new Date()),
});
// parcel x warehouse payload
exports.registerParcelXWarehouseSchema = zod_1.z.object({
    address_title: zod_1.z.string().trim().nonoptional(),
    sender_name: zod_1.z.string().trim().nonoptional(),
    full_address: zod_1.z.string().trim().nonoptional(),
    business_name: zod_1.z.string().trim().nonoptional(),
    phone: zod_1.z.string().trim().min(10, "Mobile number length must be 10").max(10),
    pincode: zod_1.z
        .string()
        .trim()
        .regex(/^\d{6}$/, "Pin code must be exactly 6 digits"),
});
