import mongoose, { Schema } from "mongoose";

const WalletLedgerSchema = new Schema(
  {
    walletId: { type: Schema.Types.ObjectId, required: true, ref: "Wallet" },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    transactionType: { type: String, required: true }, // e.g., "debit" or "credit"
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    balanceBeforeTransaction: { type: Number, required: true },
    balanceAfterTransaction: { type: Number, required: true },
    description: { type: String },
    holdBeforeTransaction: { type: Number, required: true },
    holdAfterTransaction: { type: Number, required: true },
    referenceId: { type: String }, // e.g., order ID, payment ID, etc.
    referenceType: { type: String }, // e.g., "order", "payment", etc.
    provider: { type: String }, // e.g., "Razorpay", "Stripe", etc.
    providerReferenceId: { type: String }, // e.g., Razorpay payment ID, Stripe charge ID, etc.
    idempotencyKey: { type: String, unique: true, required: true }, // to ensure idempotency of transactions
    metadata: { type: Schema.Types.Mixed }, // for any additional data related to the transaction
    createdBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true },
);

export const WalletLedgerModel = mongoose.model("WalletLedger", WalletLedgerSchema);
