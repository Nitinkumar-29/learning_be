import { Types } from "mongoose";
import { z } from "zod";

export const createWalletSchema = z.object({
  currency: z.literal("INR").optional().default("INR"),
});

export type CreateWalletDto = z.infer<typeof createWalletSchema>;

export const updateWalletSchema = z
  .object({
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export type UpdateWalletDto = z.infer<typeof updateWalletSchema>;

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
