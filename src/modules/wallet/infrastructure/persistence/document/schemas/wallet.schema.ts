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
    availableBalance: {
      type: Number,
      default: 0,
    },
    holdBalance: {
      type: Number,
      default: 0,
    },
    totalDebited: {
      type: Number,
      default: 0,
    },
    totalCredited: {
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
