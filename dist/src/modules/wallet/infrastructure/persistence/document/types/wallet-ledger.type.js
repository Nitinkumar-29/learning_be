"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWalletLedgerSchema = void 0;
const zod_1 = require("zod");
const wallet_ledger_enum_1 = require("../../../../../../common/enums/wallet-ledger.enum");
const objectIdSchema = zod_1.z
    .string()
    .trim()
    .regex(/^[a-f\d]{24}$/i, "Invalid object id");
exports.createWalletLedgerSchema = zod_1.z.object({
    walletId: objectIdSchema,
    userId: objectIdSchema,
    // walletOperationType: z.enum(Object.values(walletOperationType)),
    transactionType: zod_1.z.enum(Object.values(wallet_ledger_enum_1.transactionType)),
    transactionStatus: zod_1.z
        .enum(Object.values(wallet_ledger_enum_1.transactionStatus))
        .optional()
        .default(wallet_ledger_enum_1.transactionStatus.PENDING),
    amount: zod_1.z
        .number("Amount must be a number")
        .positive("Amount must be greater than 0"),
    currency: zod_1.z.literal("INR").optional().default("INR"),
    balanceBeforeTransaction: zod_1.z
        .number("Balance before transaction must be a number")
        .min(0, "Balance before transaction cannot be negative"),
    balanceAfterTransaction: zod_1.z
        .number("Balance after transaction must be a number")
        .min(0, "Balance after transaction cannot be negative"),
    holdBeforeTransaction: zod_1.z
        .number("Hold before transaction must be a number")
        .min(0, "Hold before transaction cannot be negative"),
    holdAfterTransaction: zod_1.z
        .number("Hold after transaction must be a number")
        .min(0, "Hold after transaction cannot be negative"),
    description: zod_1.z.string().trim().optional(),
    referenceId: zod_1.z.string().trim().optional(),
    referenceType: zod_1.z.enum(Object.values(wallet_ledger_enum_1.referenceType)),
    provider: zod_1.z.string().trim().optional(),
    providerReferenceId: zod_1.z.string().trim().optional(),
    idempotencyKey: zod_1.z.string().trim().min(1, "Idempotency key is required"),
    metadata: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
    createdBy: objectIdSchema,
});
