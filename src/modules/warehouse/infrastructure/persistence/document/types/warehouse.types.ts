import { z } from "zod";import { warehouseStatusType } from "../../../../../../common/enums/warehouse.enum";

export const registerWarehouseSchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(2, "Business name must be at least 2 characters"),
  senderName: z
    .string()
    .trim()
    .min(2, "Sender name must be at least 2 characters"),
  fullAddress: z
    .string()
    .trim()
    .min(5, "Full address must be at least 5 characters"),
  addressTitle: z
    .string()
    .trim()
    .min(2, "Address title must be at least 2 characters"),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  pinCode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Pin code must be exactly 6 digits"),
  city: z.string().trim().min(2, "City must be at least 2 characters"),
  state: z.string().trim().min(2, "State must be at least 2 characters"),
  status: z
    .enum(Object.values(warehouseStatusType), {
      message: "Invalid warehouse status",
    })
    .optional()
    .default(warehouseStatusType.PENDING),
});

export const registerWarehouseDto = registerWarehouseSchema;
export type RegisterWarehouseDto = z.infer<typeof registerWarehouseSchema>;

