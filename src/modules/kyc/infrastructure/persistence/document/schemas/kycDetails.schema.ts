import mongoose, { model, Schema } from "mongoose";
import {
  entityTypes,
  isGstOptions,
} from "../../../../../../common/enums/kyc.enum";

const kycSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  entityName: {
    type: String,
    required: true,
  },
  entityType: {
    type: String,
    required: true,
    enum: Object.values(entityTypes),
  },
  websiteUrl: { type: String, require: false },
  email: { type: String, required: true },
  mobileNumber: { type: Number, required: true },
  billingAddress: { type: String, required: true },
  zipCode: { type: Number, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },

  aadharNumber: { type: String, required: true, minlength: 12, maxlength: 12 },
  aadharCardFrontImageURL: { type: String, required: false, default: "" },
  aadharCardBackImageURL: { type: String, required: false, default: "" },

  panNumber: { type: String, required: true },
  panCardImageURL: { type: String, required: false, default: "" },
  isGst: {
    type: String,
    enum: Object.values(isGstOptions),
    default: isGstOptions.NO,
    required: false,
  },
  gstNumber: {
    type: String,
    required: function () {
      return this.isGst === isGstOptions.YES;
    },
  },
  gstCertificateLink: {
    type: String,
    required: function () {
      return this.isGst === isGstOptions.YES;
    },
  },
  verificationDone: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export const KycModel = model("kyc", kycSchema);
