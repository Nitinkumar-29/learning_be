import { z } from "zod";

const objectIdStringSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

const objectIdLikeSchema = z.preprocess((value) => {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    const maybeObjectId = value as { toString?: () => string };
    if (typeof maybeObjectId.toString === "function") {
      return maybeObjectId.toString();
    }
  }

  return value;
}, objectIdStringSchema);

export const parcelXProviderSchema = z.literal("parcelx");

export const parcelXOperationSchema = z.enum([
  "order",
  "warehouse",
  "ndr",
  "b2b",
]);

export const createParcelXRequestLogSchema = z.object({
  provider: parcelXProviderSchema.optional().default("parcelx"),
  operation: parcelXOperationSchema,
  orderId: objectIdLikeSchema.optional().nullable(),
  idempotencyKey: z.string().trim().optional().nullable(),
  requestPayload: z.unknown(),
  attempt: z.number().int().min(1).optional().default(1),
  queuedAt: z
    .date()
    .optional()
    .default(() => new Date()),
  sentAt: z.date().optional().nullable(),
});

export const createParcelXResponseLogSchema = z.object({
  requestRefId: objectIdLikeSchema,
  provider: parcelXProviderSchema.optional().default("parcelx"),
  operation: parcelXOperationSchema,
  orderId: objectIdLikeSchema.optional().nullable(),
  statusCode: z.number().int().optional().nullable(),
  success: z.boolean(),
  responsePayload: z.unknown(),
  errorCode: z.string().trim().optional().nullable(),
  errorMessage: z.string().trim().optional().nullable(),
  receivedAt: z
    .date()
    .optional()
    .default(() => new Date()),
});

export type CreateParcelXRequestLogInput = z.input<
  typeof createParcelXRequestLogSchema
>;
export type CreateParcelXRequestLogDto = z.output<
  typeof createParcelXRequestLogSchema
>;
export type CreateParcelXResponseLogInput = z.input<
  typeof createParcelXResponseLogSchema
>;
export type CreateParcelXResponseLogDto = z.output<
  typeof createParcelXResponseLogSchema
>;

// parcel x warehouse payload
export const registerParcelXWarehouseSchema = z.object({
  address_title: z.string().trim().nonoptional(),
  sender_name: z.string().trim().nonoptional(),
  full_address: z.string().trim().nonoptional(),
  business_name: z.string().trim().nonoptional(),
  phone: z.string().trim().min(10, "Mobile number length must be 10").max(10),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Pin code must be exactly 6 digits"),
});

export type RegisterParcelXWarehouseDto = z.input<
  typeof registerParcelXWarehouseSchema
>;
