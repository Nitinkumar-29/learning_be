"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWalletSchema = exports.createWalletSchema = void 0;
const zod_1 = require("zod");
exports.createWalletSchema = zod_1.z.object({
    currency: zod_1.z.literal("INR").optional().default("INR"),
});
exports.updateWalletSchema = zod_1.z
    .object({
    isActive: zod_1.z.boolean().optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
});
