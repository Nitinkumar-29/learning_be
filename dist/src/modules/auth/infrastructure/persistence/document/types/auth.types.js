"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
const auth_enum_1 = require("../../../../../../common/enums/auth.enum");
/* ---------------- LOGIN ---------------- */
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email format"),
    password: zod_1.z.string().min(1, "Password is required"),
});
/* ---------------- REGISTER ---------------- */
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(3, "Name must be at least 3 characters"),
    companyName: zod_1.z
        .string()
        .trim()
        .min(3, "Company name must be at least 3 characters"),
    email: zod_1.z.email("Invalid email format").toLowerCase(),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least one letter and one number"),
    mobileNumber: zod_1.z
        .string()
        .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
    role: zod_1.z.enum(Object.values(auth_enum_1.userRole)).optional().default(auth_enum_1.userRole.USER),
    monthlyOrder: zod_1.z
        .number("Monthly order must be a number")
        .min(0, "Monthly order cannot be negative")
        .optional()
        .default(0),
    businessType: zod_1.z.enum(Object.values(auth_enum_1.businessType), {
        message: "Invalid business type",
    }),
});
