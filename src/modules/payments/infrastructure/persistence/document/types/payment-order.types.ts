import z from "zod";
import {
  paymentModeEnums,
  paymentOrderStatusEnums,
  paymentProviderEnums,
} from "../../../../../../common/enums/payment-gateway.enum";
import { Types } from "mongoose";

export const paymentOrderSchema = z.object({
  refId: z.string().trim(),
  amountInPaise: z
    .number()
    .int({ message: "Amount must be an integer in paise" })
    .positive({ message: "Amount must be greater than 0" }),
  paymentProvider: z.enum(Object.values(paymentProviderEnums), {
    message: "Invalid provider",
  }),
  paymentMode: z.enum(Object.values(paymentModeEnums), {
    message: "Invalid payment mode",
  }),
  promoCode: z.string().trim().optional(),
});

export const paymentOrderDto = paymentOrderSchema;
export type PaymentOrderDto = z.infer<typeof paymentOrderSchema>;

export interface IPaymentOrder {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  refId: string;
  amountInPaise: number;
  paymentProvider: paymentProviderEnums;
  paymentMode?: paymentModeEnums | null | undefined;
  orderStatus?: paymentOrderStatusEnums | null | undefined;
  orderDetails: Record<string, unknown> | null;
  promoCode?: string | null;
  fee?: number | null;
  tax?: number | null;
  providerOrderId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
