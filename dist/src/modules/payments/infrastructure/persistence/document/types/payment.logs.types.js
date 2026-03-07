"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentLogCreateSchema = exports.createTransactionResponseLogSchema = exports.createTransactionRequestLogSchema = exports.createOrderResponseLogSchema = exports.createOrderRequestLogSchema = void 0;
const zod_1 = require("zod");
const payment_gateway_enum_1 = require("../../../../../../common/enums/payment-gateway.enum");
const mongoose_1 = require("mongoose");
const objectIdSchema = zod_1.z
    .union([
    zod_1.z.instanceof(mongoose_1.Types.ObjectId),
    zod_1.z
        .string()
        .trim()
        .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
])
    .transform((value) => {
    if (value instanceof mongoose_1.Types.ObjectId) {
        return value;
    }
    return new mongoose_1.Types.ObjectId(value);
})
    .nullable()
    .optional();
const baseCreateLogSchema = zod_1.z.object({
    refId: zod_1.z.string().trim().min(1),
    entityType: zod_1.z.enum(Object.values(payment_gateway_enum_1.paymentEntityTypeEnums)),
    provider: zod_1.z.enum(Object.values(payment_gateway_enum_1.paymentProviderEnums)),
    orderId: objectIdSchema,
    transactionId: objectIdSchema,
    metadata: zod_1.z.unknown().nullable().optional(),
    errorCode: zod_1.z.string().trim().nullable().optional(),
    errorReason: zod_1.z.string().trim().nullable().optional(),
});
// payloads
const createOrderRequestPayloadSchema = zod_1.z.object({
    amountInPaise: zod_1.z.number().int().positive(),
    currency: zod_1.z.string().trim().min(1),
    receipt: zod_1.z.string().trim().min(1),
});
const createOrderResponsePayloadSchema = zod_1.z.object({
    providerOrderId: zod_1.z.string().trim().min(1),
    raw: zod_1.z.unknown(),
});
const createTxnRequestPayloadSchema = zod_1.z.object({
    providerOrderId: zod_1.z.string().trim().min(1),
    paymentId: zod_1.z.string().trim().min(1),
});
const createTxnResponsePayloadSchema = zod_1.z.object({
    transactionId: zod_1.z.string().trim().min(1),
    raw: zod_1.z.unknown().optional(),
});
// 1) create order request
exports.createOrderRequestLogSchema = baseCreateLogSchema.extend({
    operation: zod_1.z.literal(payment_gateway_enum_1.paymentLogOperationEnums.CREATE_ORDER),
    stage: zod_1.z.literal(payment_gateway_enum_1.paymentLogStageEnums.REQUEST),
    event: zod_1.z.enum([
        payment_gateway_enum_1.paymentEventEnums.ORDER_INITIATED,
        payment_gateway_enum_1.paymentEventEnums.ORDER_CREATION_REQUESTED,
    ]),
    status: zod_1.z.literal(payment_gateway_enum_1.paymentLogStatusEnums.PENDING),
    requestPayload: createOrderRequestPayloadSchema,
    responsePayload: zod_1.z.null().optional(),
});
// 2) create order response
exports.createOrderResponseLogSchema = baseCreateLogSchema.extend({
    operation: zod_1.z.literal(payment_gateway_enum_1.paymentLogOperationEnums.CREATE_ORDER),
    stage: zod_1.z.literal(payment_gateway_enum_1.paymentLogStageEnums.RESPONSE),
    event: zod_1.z.enum([
        payment_gateway_enum_1.paymentEventEnums.ORDER_CREATED,
        payment_gateway_enum_1.paymentEventEnums.ORDER_CREATION_FAILED,
    ]),
    status: zod_1.z.enum([
        payment_gateway_enum_1.paymentLogStatusEnums.SUCCESS,
        payment_gateway_enum_1.paymentLogStatusEnums.FAILURE,
    ]),
    requestPayload: zod_1.z.null().optional(),
    providerOrderId: zod_1.z.string().trim().optional(),
    responsePayload: createOrderResponsePayloadSchema,
});
// 3) create transaction request
exports.createTransactionRequestLogSchema = baseCreateLogSchema.extend({
    operation: zod_1.z.literal(payment_gateway_enum_1.paymentLogOperationEnums.CREATE_TRANSACTION),
    stage: zod_1.z.literal(payment_gateway_enum_1.paymentLogStageEnums.REQUEST),
    event: zod_1.z.literal(payment_gateway_enum_1.paymentEventEnums.PAYMENT_PENDING),
    status: zod_1.z.literal(payment_gateway_enum_1.paymentLogStatusEnums.PENDING),
    requestPayload: createTxnRequestPayloadSchema,
    responsePayload: zod_1.z.null().optional(),
});
// 4) create transaction response
exports.createTransactionResponseLogSchema = baseCreateLogSchema.extend({
    operation: zod_1.z.literal(payment_gateway_enum_1.paymentLogOperationEnums.CREATE_TRANSACTION),
    stage: zod_1.z.literal(payment_gateway_enum_1.paymentLogStageEnums.RESPONSE),
    event: zod_1.z.enum([
        payment_gateway_enum_1.paymentEventEnums.TRANSACTION_CREATED,
        payment_gateway_enum_1.paymentEventEnums.PAYMENT_SUCCESS,
        payment_gateway_enum_1.paymentEventEnums.PAYMENT_FAILED,
    ]),
    status: zod_1.z.enum([
        payment_gateway_enum_1.paymentLogStatusEnums.SUCCESS,
        payment_gateway_enum_1.paymentLogStatusEnums.FAILURE,
    ]),
    requestPayload: zod_1.z.null().optional(),
    responsePayload: createTxnResponsePayloadSchema,
});
// union if needed
exports.paymentLogCreateSchema = zod_1.z.union([
    exports.createOrderRequestLogSchema,
    exports.createOrderResponseLogSchema,
    exports.createTransactionRequestLogSchema,
    exports.createTransactionResponseLogSchema,
]);
