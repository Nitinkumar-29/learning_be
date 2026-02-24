import { z } from "zod";

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Invalid object id");

export const createWalletLedgerSchema = z.object({
  walletId: objectIdSchema,
  userId: objectIdSchema,
  transactionType: z.enum([
    "credit",
    "hold",
    "debit",
    "release",
    "refund",
    "adjustment",
  ]),
  amount: z
    .number("Amount must be a number")
    .positive("Amount must be greater than 0"),
  currency: z.literal("INR").optional().default("INR"),
  balanceBeforeTransaction: z
    .number("Balance before transaction must be a number")
    .min(0, "Balance before transaction cannot be negative"),
  balanceAfterTransaction: z
    .number("Balance after transaction must be a number")
    .min(0, "Balance after transaction cannot be negative"),
  holdBeforeTransaction: z
    .number("Hold before transaction must be a number")
    .min(0, "Hold before transaction cannot be negative"),
  holdAfterTransaction: z
    .number("Hold after transaction must be a number")
    .min(0, "Hold after transaction cannot be negative"),
  description: z.string().trim().optional(),
  referenceId: z.string().trim().optional(),
  referenceType: z.string().trim().optional(),
  provider: z.string().trim().optional(),
  providerReferenceId: z.string().trim().optional(),
  idempotencyKey: z.string().trim().min(1, "Idempotency key is required"),
  metadata: z.record(z.string(), z.unknown()).optional(),
  createdBy: objectIdSchema,
});

export type CreateWalletLedgerDto = z.infer<typeof createWalletLedgerSchema>;
