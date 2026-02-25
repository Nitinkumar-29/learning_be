import mongoose, { Schema } from "mongoose";
import {
  referenceType,
  transactionType,
  transactionStatus,
} from "../../../../../../common/enums/wallet-ledger.enum";

const WalletLedgerSchema = new Schema(
  {
    walletId: { type: Schema.Types.ObjectId, required: true, ref: "Wallet" },
    // walletOperationType: {
    //   type: String,
    //   required: true,
    //   enum: Object.values(walletOperationType),
    // }, // e.g., "debit" or "credit"
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    transactionType: {
      type: String,
      required: true,
      enum: Object.values(transactionType),
    }, // e.g., "debit" or "credit"
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    balanceBeforeTransaction: { type: Number, required: true },
    balanceAfterTransaction: { type: Number, required: true },
    description: { type: String },
    holdBeforeTransaction: { type: Number, required: true },
    holdAfterTransaction: { type: Number, required: true },
    transactionStatus: {
      type: String,
      default: transactionStatus.PENDING,
      enum: Object.values(transactionStatus),
    }, // e.g., "pending", "completed", "failed"
    referenceId: { type: String }, // e.g., order ID, payment ID, etc.
    referenceType: {
      type: String,
      enum: Object.values(referenceType),
      required: true,
    }, // e.g., "order", "payment", etc.
    provider: { type: String }, // e.g., "Razorpay", "Stripe", etc.
    providerReferenceId: { type: String }, // e.g., Razorpay payment ID, Stripe charge ID, etc.
    idempotencyKey: { type: String, unique: true, required: true }, // to ensure idempotency of transactions
    metadata: { type: Schema.Types.Mixed }, // for any additional data related to the transaction
    createdBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true },
).index({ walletId: 1, createdAt: -1 }); // index for efficient querying of transactions by walletId and sorting by creation date

export const WalletLedgerModel = mongoose.model(
  "WalletLedger",
  WalletLedgerSchema,
);
