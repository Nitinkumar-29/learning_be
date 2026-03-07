"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentProviderService = void 0;
const http_error_1 = require("../../../common/errors/http.error");
const payment_gateway_enum_1 = require("../../../common/enums/payment-gateway.enum");
const payment_provider_factory_1 = require("../factory/payment-provider.factory");
const mongoose_1 = __importDefault(require("mongoose"));
const wallet_module_1 = require("../../wallet/wallet.module");
const payment_log_producer_1 = require("../queues/producers/payment-log.producer");
const payment_webhook_log_producer_1 = require("../queues/producers/payment-webhook-log.producer");
class PaymentProviderService {
    constructor(paymentOrderRepository, paymentTransactionRepository, paymentWebhookLogService) {
        this.paymentOrderRepository = paymentOrderRepository;
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.paymentWebhookLogService = paymentWebhookLogService;
    }
    resolveProvider(type) {
        return payment_provider_factory_1.PaymentProviderFactory.getProvider(type);
    }
    resolveProviderFromWebhook(headers) {
        return payment_provider_factory_1.PaymentProviderFactory.getProviderFromWebhook(headers);
    }
    isTerminalWebhookEvent(event) {
        return event === "payment.captured" || event === "order.paid";
    }
    mapProviderPaymentMode(mode) {
        if (!mode) {
            return payment_gateway_enum_1.paymentModeEnums.OTHER;
        }
        const normalized = String(mode).toLowerCase().trim();
        if (normalized === "upi") {
            return payment_gateway_enum_1.paymentModeEnums.UPI;
        }
        if (normalized === "netbanking" || normalized === "internet_banking") {
            return payment_gateway_enum_1.paymentModeEnums.INTERNET_BANKING;
        }
        return payment_gateway_enum_1.paymentModeEnums.OTHER;
    }
    async finalizePaymentFromWebhook(webhookData) {
        if (!this.isTerminalWebhookEvent(webhookData.event)) {
            return;
        }
        if (!webhookData.providerOrderId || !webhookData.paymentId) {
            return;
        }
        const applyFinalization = async (session) => {
            const paymentOrder = await this.paymentOrderRepository.findByGatewayOrderId(webhookData.providerOrderId, session);
            if (!paymentOrder) {
                throw new http_error_1.HttpError(404, "Payment order not found for webhook event");
            }
            const existingTxn = await this.paymentTransactionRepository.findByGatewayPaymentId(webhookData.paymentId, session);
            const completionTime = new Date();
            let finalTxn = existingTxn;
            const mappedPaymentMode = this.mapProviderPaymentMode(webhookData.paymentMode);
            if (!finalTxn) {
                finalTxn = await this.paymentTransactionRepository.create({
                    refId: paymentOrder.refId,
                    userId: paymentOrder.userId,
                    orderId: paymentOrder._id,
                    amountInPaise: webhookData.amountInPaise ?? paymentOrder.amountInPaise,
                    paymentMode: mappedPaymentMode,
                    provider: paymentOrder.provider,
                    providerPaymentId: webhookData.paymentId,
                    status: payment_gateway_enum_1.paymentTransactionStatusEnums.PAYMENT_SUCCESS,
                    paymentCompletedAt: completionTime,
                }, session);
                await wallet_module_1.walletModule.walletService.creditFromPayment({
                    userId: paymentOrder.userId.toString(),
                    amountInPaise: webhookData.amountInPaise ?? paymentOrder.amountInPaise,
                    referenceId: paymentOrder.refId,
                    provider: paymentOrder.provider,
                    providerReferenceId: webhookData.paymentId,
                    idempotencyKey: `wallet-credit-${webhookData.paymentId}`,
                    metadata: {
                        orderId: paymentOrder._id.toString(),
                        transactionId: finalTxn._id.toString(),
                        providerOrderId: paymentOrder.providerOrderId,
                    },
                    createdBy: paymentOrder.userId.toString(),
                }, session);
            }
            await this.paymentOrderRepository.updateOne({
                refId: paymentOrder.refId,
                payload: {
                    providerOrderId: paymentOrder.providerOrderId,
                    orderDetails: paymentOrder.orderDetails,
                    paymentMode: mappedPaymentMode,
                    orderStatus: payment_gateway_enum_1.paymentOrderStatusEnums.ORDER_COMPLETED,
                    paymentCompletedAt: completionTime,
                },
                session,
            });
            return {
                paymentOrder,
                transactionId: finalTxn?._id || null,
            };
        };
        const session = await mongoose_1.default.startSession();
        let finalizationResult = null;
        try {
            try {
                await session.withTransaction(async () => {
                    finalizationResult = await applyFinalization(session);
                });
            }
            catch (error) {
                const message = String(error?.message || "");
                const transactionUnsupported = message.includes("Transaction numbers are only allowed on a replica set member or mongos") || message.includes("replica set");
                if (!transactionUnsupported) {
                    throw error;
                }
                // Fallback for standalone MongoDB in local/dev.
                finalizationResult = await applyFinalization();
            }
        }
        finally {
            await session.endSession();
        }
        if (finalizationResult?.paymentOrder) {
            const transactionId = finalizationResult.transactionId?.toString?.() ??
                finalizationResult.transactionId ??
                null;
            const logOrderResponsePayload = {
                refId: finalizationResult.paymentOrder.refId,
                entityType: payment_gateway_enum_1.paymentEntityTypeEnums.ORDER,
                event: payment_gateway_enum_1.paymentEventEnums.ORDER_CREATED,
                operation: payment_gateway_enum_1.paymentLogOperationEnums.CREATE_ORDER,
                provider: finalizationResult.paymentOrder.provider,
                providerOrderId: finalizationResult.paymentOrder.providerOrderId || undefined,
                responsePayload: {
                    providerOrderId: finalizationResult.paymentOrder.providerOrderId || "NA",
                    raw: finalizationResult.paymentOrder.orderDetails || {},
                },
                stage: payment_gateway_enum_1.paymentLogStageEnums.RESPONSE,
                status: payment_gateway_enum_1.paymentLogStatusEnums.SUCCESS,
                orderId: finalizationResult.paymentOrder._id,
                transactionId,
            };
            void (0, payment_log_producer_1.enqueuePaymentLogJob)({
                jobName: payment_log_producer_1.paymentLogQueueJobs.CREATE_ORDER_RESPONSE,
                payload: logOrderResponsePayload,
            }).catch((error) => {
                console.error("enqueue order response log with transactionId failed", error);
            });
        }
    }
    async createOrder({ paymentOrder, userId, }) {
        // before creating order check wallet is available or not as we are only allowing payments for wallet credit for now
        await wallet_module_1.walletModule.walletService.getWallet(userId);
        const paymentOrderCreationResult = await this.paymentOrderRepository.create({
            paymentOrder,
            userId,
        });
        let logOrderRequestPayload;
        let logOrderResponsePayload;
        logOrderRequestPayload = {
            refId: paymentOrderCreationResult.refId,
            entityType: payment_gateway_enum_1.paymentEntityTypeEnums.ORDER,
            event: payment_gateway_enum_1.paymentEventEnums.ORDER_INITIATED,
            operation: payment_gateway_enum_1.paymentLogOperationEnums.CREATE_ORDER,
            stage: payment_gateway_enum_1.paymentLogStageEnums.REQUEST,
            provider: paymentOrderCreationResult.provider,
            status: payment_gateway_enum_1.paymentLogStatusEnums.PENDING,
            orderId: paymentOrderCreationResult?._id,
            requestPayload: {
                amountInPaise: paymentOrderCreationResult.amountInPaise,
                currency: "INR",
                receipt: paymentOrderCreationResult.refId,
            },
        };
        void (0, payment_log_producer_1.enqueuePaymentLogJob)({
            jobName: payment_log_producer_1.paymentLogQueueJobs.CREATE_ORDER_REQUEST,
            payload: logOrderRequestPayload,
        }).catch((error) => console.log(error));
        let providerOrderResponse;
        try {
            providerOrderResponse = await this.resolveProvider(paymentOrder.provider).createOrder({
                amountInPaise: paymentOrderCreationResult.amountInPaise,
                receipt: paymentOrderCreationResult.refId,
                currency: "INR",
            });
        }
        catch (error) {
            try {
                await this.paymentOrderRepository.updateOne({
                    refId: paymentOrderCreationResult.refId,
                    payload: {
                        orderDetails: {},
                        providerOrderId: null,
                        orderStatus: payment_gateway_enum_1.paymentOrderStatusEnums.ORDER_FAILED,
                    },
                });
                logOrderResponsePayload = {
                    refId: paymentOrderCreationResult.refId,
                    entityType: payment_gateway_enum_1.paymentEntityTypeEnums.ORDER,
                    event: payment_gateway_enum_1.paymentEventEnums.ORDER_CREATION_FAILED,
                    operation: payment_gateway_enum_1.paymentLogOperationEnums.CREATE_ORDER,
                    provider: paymentOrderCreationResult.provider,
                    providerOrderId: providerOrderResponse?.id,
                    responsePayload: {
                        providerOrderId: providerOrderResponse?.id || "NA",
                        raw: providerOrderResponse,
                    },
                    stage: payment_gateway_enum_1.paymentLogStageEnums.RESPONSE,
                    status: payment_gateway_enum_1.paymentLogStatusEnums.FAILURE,
                    errorCode: providerOrderResponse?.errorCode || 500,
                    errorReason: providerOrderResponse?.error?.reason || "no valid reason provided",
                    orderId: paymentOrderCreationResult?._id,
                };
                void (0, payment_log_producer_1.enqueuePaymentLogJob)({
                    jobName: payment_log_producer_1.paymentLogQueueJobs.CREATE_ORDER_RESPONSE,
                    payload: logOrderResponsePayload,
                }).catch((error) => console.log(error));
            }
            catch {
                // Preserve the original provider failure.
            }
            throw error;
        }
        const updatedRecord = await this.paymentOrderRepository.updateOne({
            refId: providerOrderResponse.receipt || paymentOrderCreationResult.refId,
            payload: {
                orderDetails: providerOrderResponse,
                providerOrderId: providerOrderResponse.id,
                orderStatus: payment_gateway_enum_1.paymentOrderStatusEnums.ORDER_CREATED,
            },
        });
        if (!updatedRecord) {
            throw new http_error_1.HttpError(500, "Payment order created at provider but local order update failed");
        }
        logOrderResponsePayload = {
            refId: paymentOrderCreationResult.refId,
            entityType: payment_gateway_enum_1.paymentEntityTypeEnums.ORDER,
            event: payment_gateway_enum_1.paymentEventEnums.ORDER_CREATED,
            operation: payment_gateway_enum_1.paymentLogOperationEnums.CREATE_ORDER,
            provider: paymentOrderCreationResult.provider,
            providerOrderId: providerOrderResponse?.id,
            responsePayload: {
                providerOrderId: providerOrderResponse?.id,
                raw: providerOrderResponse,
            },
            stage: payment_gateway_enum_1.paymentLogStageEnums.RESPONSE,
            status: payment_gateway_enum_1.paymentLogStatusEnums.SUCCESS,
            orderId: paymentOrderCreationResult?._id,
        };
        void (0, payment_log_producer_1.enqueuePaymentLogJob)({
            jobName: payment_log_producer_1.paymentLogQueueJobs.CREATE_ORDER_RESPONSE,
            payload: logOrderResponsePayload,
        }).catch((err) => console.log(err));
        return updatedRecord;
    }
    async processWebhook(req) {
        let webhookData;
        try {
            const provider = this.resolveProviderFromWebhook(req.headers);
            webhookData = await provider.processWebhook(req);
            const isDuplicate = await this.paymentWebhookLogService.isDuplicateEvent(webhookData.provider, webhookData.eventId);
            if (isDuplicate) {
                return {
                    ...webhookData,
                    eventState: "ignored",
                };
            }
            if (webhookData.eventState === "processed") {
                await this.finalizePaymentFromWebhook(webhookData);
            }
            void (0, payment_webhook_log_producer_1.enqueuePaymentWebhookLogJob)({
                jobName: payment_webhook_log_producer_1.paymentWebhookLogQueueJobs.UPSERT,
                payload: webhookData,
            }).catch((error) => {
                console.error("enqueue webhook log failed", error);
            });
            return webhookData;
        }
        catch (error) {
            void (0, payment_webhook_log_producer_1.enqueuePaymentWebhookLogJob)({
                jobName: payment_webhook_log_producer_1.paymentWebhookLogQueueJobs.MARK_FAILED,
                payload: {
                    provider: webhookData?.provider || payment_gateway_enum_1.paymentProviderEnums.RAZORPAY,
                    eventId: webhookData?.eventId || null,
                    event: webhookData?.event || undefined,
                    rawPayload: webhookData?.rawPayload,
                    errorMessage: error?.message || "Webhook processing failed",
                },
            }).catch((enqueueError) => {
                console.error("enqueue webhook failure log failed", enqueueError);
            });
            if (error instanceof http_error_1.HttpError) {
                throw error;
            }
            throw new http_error_1.HttpError(500, error?.message || "Webhook processing failed");
        }
    }
    async verifyPayment(payload) {
        // if paymentid provided then check transactions first
        const transaction = await this.paymentTransactionRepository.findByGatewayPaymentId(payload.paymentId);
        if (!transaction && payload.orderId) {
            // check order exist or not wiht orderId
            const order = await this.paymentOrderRepository.findByGatewayOrderId(payload.orderId);
            if (!order) {
                throw new http_error_1.HttpError(404, "No transation or payment order record found, please contact support!");
            }
            // if found theck for provider
            const provider = order.provider;
            // validate signature first
            const resolvedSignatureVerification = this.resolveProvider(provider).verifyCheckoutSignature(payload);
            if (!resolvedSignatureVerification) {
                throw new http_error_1.HttpError(400, "Invalid provider signature");
            }
            const result = await this.resolveProvider(provider).fetchPaymentStatus(payload);
            return result;
        }
        return transaction;
        // return this.resolveProvider(payload.paymentProvider);
    }
}
exports.PaymentProviderService = PaymentProviderService;
