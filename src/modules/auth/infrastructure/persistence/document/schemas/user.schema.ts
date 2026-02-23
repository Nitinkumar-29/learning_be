import { Schema, model } from "mongoose";
import {
  businessType,
  userRole,
} from "../../../../../../common/enums/auth.enum";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // 🔥 important
    },
    mobileNumber: {
      type: String,
      required: true,
      maxlength: 10,
    },
    role: {
      type: String,
      enum: Object.values(userRole),
      default: userRole.USER,
      required: true,
    },
    isKycDone: {
      type: Boolean,
      default: false,
    },
    monthlyOrder: {
      type: Number,
      default: 0,
    },
    businessType: {
      type: String,
      required: true,
      enum: Object.values(businessType),
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    passwordResetToken: {
      type: String,
      default: null,
      select: false, // 🔥 hide by default
    },
    passwordResetExpires: {
      type: Date,
      default: null,
      select: false, // 🔥 hide by default
    },
    tokenVersion: {
      default: 0,
      type: Number,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// 🔥 Proper toJSON transform
userSchema.set("toJSON", {
  transform: (_doc, ret: any) => {
    delete ret.password;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    return ret;
  },
});

export const User = model("User", userSchema);
