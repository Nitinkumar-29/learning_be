"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderSchema = void 0;
const zod_1 = require("zod");
const order_enum_1 = require("../../../../../../common/enums/order.enum");
const orderItemSchema = zod_1.z.object({
    sku: zod_1.z.string().trim().min(1, "Item sku is required"),
    name: zod_1.z.string().trim().min(1, "Item name is required"),
    category: zod_1.z.string().trim().optional(),
    quantity: zod_1.z.number().int().positive("Item quantity must be greater than 0"),
    unitPrice: zod_1.z.number().nonnegative("Item unitPrice cannot be negative"),
    taxPercent: zod_1.z
        .number()
        .nonnegative("Item taxPercent cannot be negative")
        .optional(),
});
const consigneeSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, "Consignee name is required"),
    email: zod_1.z.email("Invalid consignee email format").optional(),
    mobile: zod_1.z
        .string()
        .trim()
        .regex(/^\d{10}$/, "Consignee mobile must be 10 digits"),
    phone: zod_1.z.string().trim().optional(),
    pincode: zod_1.z
        .string()
        .trim()
        .regex(/^\d{6}$/, "Consignee pincode must be 6 digits"),
    address1: zod_1.z.string().trim().min(5, "Consignee address1 is required"),
    address2: zod_1.z.string().trim().optional(),
    city: zod_1.z.string().trim().min(2, "Consignee city is required"),
    state: zod_1.z.string().trim().min(2, "Consignee state is required"),
    country: zod_1.z.string().trim().optional().default("India"),
    addressType: zod_1.z
        .enum(Object.values(order_enum_1.addressType))
        .optional()
        .default(order_enum_1.addressType.OTHER),
});
const shipmentArraySchema = zod_1.z
    .array(zod_1.z.number().positive("Shipment dimensions must be greater than 0"))
    .min(1, "Shipment dimensions are required");
exports.createOrderSchema = zod_1.z
    .object({
    clientOrderId: zod_1.z.string().trim().optional(),
    invoiceNumber: zod_1.z.string().trim().min(1, "Invoice number is required"),
    paymentMethod: zod_1.z.enum(Object.values(order_enum_1.paymentMethods), {
        message: "Invalid payment method",
    }),
    expressType: zod_1.z.enum(Object.values(order_enum_1.expressTypes), {
        message: "Invalid express type",
    }),
    pickAddressId: zod_1.z.string().trim().min(1, "pickAddressId is required"),
    returnAddressId: zod_1.z.string().trim().optional(),
    consignee: consigneeSchema,
    items: zod_1.z.array(orderItemSchema).min(1, "At least one item is required"),
    charges: zod_1.z.object({
        orderAmount: zod_1.z.number().nonnegative("orderAmount cannot be negative"),
        codAmount: zod_1.z
            .number()
            .nonnegative("codAmount cannot be negative")
            .optional()
            .default(0),
        taxAmount: zod_1.z
            .number()
            .nonnegative("taxAmount cannot be negative")
            .optional()
            .default(0),
        extraCharges: zod_1.z
            .number()
            .nonnegative("extraCharges cannot be negative")
            .optional()
            .default(0),
    }),
    shipment: zod_1.z.object({
        width: shipmentArraySchema,
        height: shipmentArraySchema,
        length: shipmentArraySchema,
        weight: shipmentArraySchema,
        mps: zod_1.z
            .number()
            .int()
            .nonnegative("mps cannot be negative")
            .optional()
            .default(0),
    }),
})
    .superRefine((data, ctx) => {
    const { width, height, length, weight } = data.shipment;
    const sameLength = width.length === height.length &&
        height.length === length.length &&
        length.length === weight.length;
    if (!sameLength) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: "shipment width, height, length and weight must have the same number of entries",
            path: ["shipment"],
        });
    }
});
