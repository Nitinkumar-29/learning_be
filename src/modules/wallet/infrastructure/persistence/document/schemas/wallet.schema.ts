import mongoose, { Schema } from "mongoose";

const WalletSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
    },
    currency: {
      type: String,
      default: "INR",
    },
    availableBalanceInPaise: {
      type: Number,
      default: 0,
    },
    holdBalanceInPaise: {
      type: Number,
      default: 0,
    },
    totalDebitedInPaise: {
      type: Number,
      default: 0,
    },
    totalCreditedInPaise: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const WalletModel = mongoose.model("Wallet", WalletSchema);
