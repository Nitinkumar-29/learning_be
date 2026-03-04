import { z } from "zod";
import {
  paymentEntityTypeEnums,
  paymentEventEnums,
  paymentLogOperationEnums,
  paymentLogStageEnums,
  paymentLogStatusEnums,
  paymentProviderEnums,
} from "../../../../../../common/enums/payment-gateway.enum";
import { Types } from "mongoose";

const objectIdSchema = z
  .union([
    z.instanceof(Types.ObjectId),
    z
      .string()
      .trim()
      .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
  ])
  .transform((value) => {
    if (value instanceof Types.ObjectId) {
      return value;
    }
    return new Types.ObjectId(value);
  })
  .nullable()
  .optional();

const baseCreateLogSchema = z.object({
  refId: z.string().trim().min(1),
  entityType: z.enum(
    Object.values(paymentEntityTypeEnums) as [string, ...string[]],
  ),
  provider: z.enum(
    Object.values(paymentProviderEnums) as [string, ...string[]],
  ),
  orderId: objectIdSchema,
  transactionId: objectIdSchema,
  metadata: z.unknown().nullable().optional(),
  errorCode: z.string().trim().nullable().optional(),
  errorReason: z.string().trim().nullable().optional(),
});

// payloads
const createOrderRequestPayloadSchema = z.object({
  amountInPaise: z.number().int().positive(),
  currency: z.string().trim().min(1),
  receipt: z.string().trim().min(1),
});

const createOrderResponsePayloadSchema = z.object({
  providerOrderId: z.string().trim().min(1),
  raw: z.unknown(),
});

const createTxnRequestPayloadSchema = z.object({
  providerOrderId: z.string().trim().min(1),
  paymentId: z.string().trim().min(1),
});

const createTxnResponsePayloadSchema = z.object({
  transactionId: z.string().trim().min(1),
  raw: z.unknown().optional(),
});

// 1) create order request
export const createOrderRequestLogSchema = baseCreateLogSchema.extend({
  operation: z.literal(paymentLogOperationEnums.CREATE_ORDER),
  stage: z.literal(paymentLogStageEnums.REQUEST),
  event: z.enum([
    paymentEventEnums.ORDER_INITIATED,
    paymentEventEnums.ORDER_CREATION_REQUESTED,
  ] as [string, ...string[]]),
  status: z.literal(paymentLogStatusEnums.PENDING),
  requestPayload: createOrderRequestPayloadSchema,
  responsePayload: z.null().optional(),
});

// 2) create order response
export const createOrderResponseLogSchema = baseCreateLogSchema.extend({
  operation: z.literal(paymentLogOperationEnums.CREATE_ORDER),
  stage: z.literal(paymentLogStageEnums.RESPONSE),
  event: z.enum([
    paymentEventEnums.ORDER_CREATED,
    paymentEventEnums.ORDER_CREATION_FAILED,
  ] as [string, ...string[]]),
  status: z.enum([
    paymentLogStatusEnums.SUCCESS,
    paymentLogStatusEnums.FAILURE,
  ] as [string, ...string[]]),
  requestPayload: z.null().optional(),
  providerOrderId: z.string().trim().optional(),
  responsePayload: createOrderResponsePayloadSchema,
});

// 3) create transaction request
export const createTransactionRequestLogSchema = baseCreateLogSchema.extend({
  operation: z.literal(paymentLogOperationEnums.CREATE_TRANSACTION),
  stage: z.literal(paymentLogStageEnums.REQUEST),
  event: z.literal(paymentEventEnums.PAYMENT_PENDING),
  status: z.literal(paymentLogStatusEnums.PENDING),
  requestPayload: createTxnRequestPayloadSchema,
  responsePayload: z.null().optional(),
});

// 4) create transaction response
export const createTransactionResponseLogSchema = baseCreateLogSchema.extend({
  operation: z.literal(paymentLogOperationEnums.CREATE_TRANSACTION),
  stage: z.literal(paymentLogStageEnums.RESPONSE),
  event: z.enum([
    paymentEventEnums.TRANSACTION_CREATED,
    paymentEventEnums.PAYMENT_SUCCESS,
    paymentEventEnums.PAYMENT_FAILED,
  ] as [string, ...string[]]),
  status: z.enum([
    paymentLogStatusEnums.SUCCESS,
    paymentLogStatusEnums.FAILURE,
  ] as [string, ...string[]]),
  requestPayload: z.null().optional(),
  responsePayload: createTxnResponsePayloadSchema,
});

// union if needed
export const paymentLogCreateSchema = z.union([
  createOrderRequestLogSchema,
  createOrderResponseLogSchema,
  createTransactionRequestLogSchema,
  createTransactionResponseLogSchema,
]);

// TS types
export type CreateOrderRequestLogDto = z.infer<
  typeof createOrderRequestLogSchema
>;
export type CreateOrderResponseLogDto = z.infer<
  typeof createOrderResponseLogSchema
>;
export type CreateTransactionRequestLogDto = z.infer<
  typeof createTransactionRequestLogSchema
>;
export type CreateTransactionResponseLogDto = z.infer<
  typeof createTransactionResponseLogSchema
>;
export type PaymentLogCreateDto = z.infer<typeof paymentLogCreateSchema>;
