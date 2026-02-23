import mongoose, { model, Schema } from "mongoose";
import { accountTypes } from "../../../../../../common/enums/kyc.enum";

const kycBankDetailsSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    accountHolderName: { type: String, required: true },
    accountType: {
      type: String,
      enum: Object.values(accountTypes),
      required: true,
    },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    bankName: { type: String, required: true },
    bankBranch: { type: String, required: true },
    bankAddress: { type: String }, // optional, can be collected or fetched from IFSC

    cancelledChequeImageUrl: { type: String, required: true },

    isOldCancelledChequeAccepted: { type: Boolean, default: false },
    kycId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "kyc",
      unique: true,
      required: true,
    },
    verificationDone: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false },
);

export const kycBankDetailsModel = model(
  "kycbankdetails",
  kycBankDetailsSchema,
);
