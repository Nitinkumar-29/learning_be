import { Types } from "mongoose";
import { z } from "zod";

/* ---------------- LOGIN ---------------- */

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export type LoginDto = z.infer<typeof loginSchema>;

/* ---------------- REGISTER ---------------- */

export const registerSchema = z.object({
  email: z.string().trim().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  mobileNumber: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  role: z.enum(["admin", "user"]).optional().default("user"),
});

export type RegisterDto = z.infer<typeof registerSchema>;

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  mobileNumber: string;
  role: "admin" | "user";
}