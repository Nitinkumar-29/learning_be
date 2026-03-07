"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerWarehouseDto = exports.registerWarehouseSchema = void 0;
const zod_1 = require("zod");
const warehouse_enum_1 = require("../../../../../../common/enums/warehouse.enum");
exports.registerWarehouseSchema = zod_1.z.object({
    businessName: zod_1.z
        .string()
        .trim()
        .min(2, "Business name must be at least 2 characters"),
    senderName: zod_1.z
        .string()
        .trim()
        .min(2, "Sender name must be at least 2 characters"),
    fullAddress: zod_1.z
        .string()
        .trim()
        .min(5, "Full address must be at least 5 characters"),
    addressTitle: zod_1.z
        .string()
        .trim()
        .min(2, "Address title must be at least 2 characters"),
    phone: zod_1.z
        .string()
        .trim()
        .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
    pinCode: zod_1.z
        .string()
        .trim()
        .regex(/^\d{6}$/, "Pin code must be exactly 6 digits"),
    city: zod_1.z.string().trim().min(2, "City must be at least 2 characters"),
    state: zod_1.z.string().trim().min(2, "State must be at least 2 characters"),
    status: zod_1.z
        .enum(Object.values(warehouse_enum_1.warehouseStatusType), {
        message: "Invalid warehouse status",
    })
        .optional()
        .default(warehouse_enum_1.warehouseStatusType.PENDING),
});
exports.registerWarehouseDto = exports.registerWarehouseSchema;
