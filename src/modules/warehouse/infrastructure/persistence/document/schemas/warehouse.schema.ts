import mongoose, { Schema } from "mongoose";
import { warehouseStatusType } from "../../../../../../common/enums/warehouse.enum";

const WarehouseSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    fullAddress: {
      type: String,
      required: true,
      unique: true,
    },
    addressTitle: {
      type: String,
      required: true,
    },
    phone: { type: String, required: true },
    pinCode: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    status: {
      type: String,
      required: false,
      default: warehouseStatusType.PENDING,
      enum: Object.values(warehouseStatusType),
    },
    parcelXStatus: {
      type: String,
      required: false,
      default: warehouseStatusType.PENDING,
      enum: Object.values(warehouseStatusType),
    },
  },
  { timestamps: true },
);

export const warehouseModel = mongoose.model("Warehouse", WarehouseSchema);
