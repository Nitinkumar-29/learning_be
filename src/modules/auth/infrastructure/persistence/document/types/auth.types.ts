import { Types } from "mongoose";
import { z } from "zod";
import {
  businessType,
  userRole,
} from "../../../../../../common/enums/auth.enum";

/* ---------------- LOGIN ---------------- */

export const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export type LoginDto = z.infer<typeof loginSchema>;

/* ---------------- REGISTER ---------------- */

export const registerSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters"),
  companyName: z
    .string()
    .trim()
    .min(3, "Company name must be at least 3 characters"),
  email: z.email("Invalid email format").toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one letter and one number",
    ),
  mobileNumber: z
    .string()
    .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  role: z.enum(Object.values(userRole)).optional().default(userRole.USER),
  monthlyOrder: z
    .number("Monthly order must be a number")
    .min(0, "Monthly order cannot be negative")
    .optional()
    .default(0),
  businessType: z.enum(Object.values(businessType), {
    message: "Invalid business type",
  }),
});

export type RegisterDto = z.infer<typeof registerSchema>;

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  mobileNumber: string;
  role: userRole;
  monthlyOrder: number;
  password: string;
  businessType: businessType;
  isKycDone: boolean;
  isActive: boolean;
  companyName: string;
  name: string;
  updatedAt: Date;
  createdAt: Date;
}