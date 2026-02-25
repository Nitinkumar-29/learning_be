import { Types } from "mongoose";
import { z } from "zod";
import {
  addressType,
  expressTypes,
  orderStatus,
  paymentMethods,
} from "../../../../../../common/enums/order.enum";

const orderItemSchema = z.object({
  sku: z.string().trim().min(1, "Item sku is required"),
  name: z.string().trim().min(1, "Item name is required"),
  category: z.string().trim().optional(),
  quantity: z.number().int().positive("Item quantity must be greater than 0"),
  unitPrice: z.number().nonnegative("Item unitPrice cannot be negative"),
  taxPercent: z.number().nonnegative("Item taxPercent cannot be negative").optional(),
});

const consigneeSchema = z.object({
  name: z.string().trim().min(2, "Consignee name is required"),
  email: z.email("Invalid consignee email format").optional(),
  mobile: z.string().trim().regex(/^\d{10}$/, "Consignee mobile must be 10 digits"),
  phone: z.string().trim().optional(),
  pincode: z.string().trim().regex(/^\d{6}$/, "Consignee pincode must be 6 digits"),
  address1: z.string().trim().min(5, "Consignee address1 is required"),
  address2: z.string().trim().optional(),
  city: z.string().trim().min(2, "Consignee city is required"),
  state: z.string().trim().min(2, "Consignee state is required"),
  country: z.string().trim().optional().default("India"),
  addressType: z.enum(Object.values(addressType)).optional().default(addressType.OTHER),
});

const shipmentArraySchema = z
  .array(z.number().positive("Shipment dimensions must be greater than 0"))
  .min(1, "Shipment dimensions are required");

export const createOrderSchema = z
  .object({
    clientOrderId: z.string().trim().optional(),
    invoiceNumber: z.string().trim().min(1, "Invoice number is required"),
    paymentMethod: z.enum(Object.values(paymentMethods), {
      message: "Invalid payment method",
    }),
    expressType: z.enum(Object.values(expressTypes), {
      message: "Invalid express type",
    }),
    pickAddressId: z.string().trim().min(1, "pickAddressId is required"),
    returnAddressId: z.string().trim().optional(),
    consignee: consigneeSchema,
    items: z.array(orderItemSchema).min(1, "At least one item is required"),
    charges: z.object({
      orderAmount: z.number().nonnegative("orderAmount cannot be negative"),
      codAmount: z.number().nonnegative("codAmount cannot be negative").optional().default(0),
      taxAmount: z.number().nonnegative("taxAmount cannot be negative").optional().default(0),
      extraCharges: z
        .number()
        .nonnegative("extraCharges cannot be negative")
        .optional()
        .default(0),
    }),
    shipment: z.object({
      width: shipmentArraySchema,
      height: shipmentArraySchema,
      length: shipmentArraySchema,
      weight: shipmentArraySchema,
      mps: z.number().int().nonnegative("mps cannot be negative").optional().default(0),
    }),
  })
  .superRefine((data, ctx) => {
    const { width, height, length, weight } = data.shipment;
    const sameLength =
      width.length === height.length &&
      height.length === length.length &&
      length.length === weight.length;

    if (!sameLength) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "shipment width, height, length and weight must have the same number of entries",
        path: ["shipment"],
      });
    }
  });

export type CreateOrderDto = z.infer<typeof createOrderSchema>;

export interface IOrder {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  orderNumber: string;
  clientOrderId?: string | null;
  status: orderStatus;
  paymentMethod: paymentMethods;
  expressType: expressTypes;
  invoiceNumber: string;
  pickAddressId: string;
  returnAddressId?: string | null;
  consignee: {
    name: string;
    email?: string | null;
    mobile: string;
    phone?: string | null;
    pincode: string;
    address1: string;
    address2?: string | null;
    city: string;
    state: string;
    country: string;
    addressType: addressType;
  };
  items: Array<{
    sku: string;
    name: string;
    category?: string | null;
    quantity: number;
    unitPrice: number;
    taxPercent?: number;
  }>;
  shipment: {
    width: number[];
    height: number[];
    length: number[];
    weight: number[];
    mps: number;
  };
  charges: {
    orderAmount: number;
    codAmount: number;
    taxAmount: number;
    extraCharges: number;
    totalAmount: number;
  };
  providerSyncStatus: "queued" | "processing" | "success" | "failed";
  parcelxRequestRefId?: Types.ObjectId | null;
  parcelxResponseRefId?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}
