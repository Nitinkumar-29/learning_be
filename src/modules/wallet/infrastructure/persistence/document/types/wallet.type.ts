import { Types } from "mongoose";
import { z } from "zod";

export const createWalletSchema = z.object({
  currency: z.literal("INR").optional().default("INR"),
  availableBalance: z
    .number("Available balance must be a number")
    .min(0, "Available balance cannot be negative")
    .optional()
    .default(0),
  holdBalance: z
    .number("Hold balance must be a number")
    .min(0, "Hold balance cannot be negative")
    .optional()
    .default(0),
  totalDebited: z
    .number("Total debited must be a number")
    .min(0, "Total debited cannot be negative")
    .optional()
    .default(0),
  totalCredited: z
    .number("Total credited must be a number")
    .min(0, "Total credited cannot be negative")
    .optional()
    .default(0),
  isActive: z.boolean().optional().default(true),
});

export type CreateWalletDto = z.infer<typeof createWalletSchema>;

export interface IWallet {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  currency: "INR";
  availableBalance: number;
  holdBalance: number;
  totalDebited: number;
  totalCredited: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
