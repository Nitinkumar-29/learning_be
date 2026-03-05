import { HttpError } from "../../../common/errors/http.error";
import {
  paymentEntityTypeEnums,
  paymentEventEnums,
  paymentLogOperationEnums,
  paymentLogStageEnums,
  paymentLogStatusEnums,
  paymentModeEnums,
  paymentOrderStatusEnums,
  paymentProviderEnums,
  paymentTransactionStatusEnums,
} from "../../../common/enums/payment-gateway.enum";
import { PaymentProviderFactory } from "../factory/payment-provider.factory";
import { PaymentOrderDto } from "../infrastructure/persistence/document/types/payment-order.types";
import { PaymentProvider } from "../interfaces/payment-provider.interface";
import { PaymentOrderRepository } from "../infrastructure/persistence/abstraction/payment-order.repository";
import { PaymentTransactionRepository } from "../infrastructure/persistence/abstraction/payment-transaction.repository";
import {
  CreateOrderRequestLogDto,
  CreateOrderResponseLogDto,
} from "../infrastructure/persistence/document/types/payment.logs.types";
import mongoose from "mongoose";
import { ClientSession } from "mongoose";
import { walletModule } from "../../wallet/wallet.module";
import {
  enqueuePaymentLogJob,
  paymentLogQueueJobs,
} from "../queues/producers/payment-log.producer";
import {
  enqueuePaymentWebhookLogJob,
  paymentWebhookLogQueueJobs,
} from "../queues/producers/payment-webhook-log.producer";
import { PaymentWebhookLogService } from "./payment-webhook-log.service";
import { VerifyPaymentRequestDto } from "../types/request-valiation.types";

export class PaymentProviderService {
  constructor(
    private readonly paymentOrderRepository: PaymentOrderRepository,
    private readonly paymentTransactionRepository: PaymentTransactionRepository,
    private readonly paymentWebhookLogService: PaymentWebhookLogService,
  ) {}

  private resolveProvider(type: paymentProviderEnums): PaymentProvider {
    return PaymentProviderFactory.getProvider(type);
  }

  private resolveProviderFromWebhook(headers: any): PaymentProvider {
    return PaymentProviderFactory.getProviderFromWebhook(headers);
  }

  private isTerminalWebhookEvent(event: string): boolean {
    return event === "payment.captured" || event === "order.paid";
  }

  private mapProviderPaymentMode(
    mode: string | null | undefined,
  ): paymentModeEnums {
    if (!mode) {
      return paymentModeEnums.OTHER;
    }

    const normalized = String(mode).toLowerCase().trim();
    if (normalized === "upi") {
      return paymentModeEnums.UPI;
    }
    if (normalized === "netbanking" || normalized === "internet_banking") {
      return paymentModeEnums.INTERNET_BANKING;
    }
    return paymentModeEnums.OTHER;
  }

  private async finalizePaymentFromWebhook(webhookData: {
    event: string;
    providerOrderId: string | null;
    paymentId: string | null;
    paymentMode: string | null;
    amountInPaise: number | null;
  }): Promise<void> {
    if (!this.isTerminalWebhookEvent(webhookData.event)) {
      return;
    }

    if (!webhookData.providerOrderId || !webhookData.paymentId) {
      return;
    }

    const applyFinalization = async (
      session?: ClientSession,
    ): Promise<{
      paymentOrder: any;
      transactionId: any;
    }> => {
      const paymentOrder =
        await this.paymentOrderRepository.findByGatewayOrderId(
          webhookData.providerOrderId!,
          session,
        );

      if (!paymentOrder) {
        throw new HttpError(404, "Payment order not found for webhook event");
      }

      const existingTxn =
        await this.paymentTransactionRepository.findByGatewayPaymentId(
          webhookData.paymentId!,
          session,
        );

      const completionTime = new Date();
      let finalTxn = existingTxn;
      const mappedPaymentMode = this.mapProviderPaymentMode(
        webhookData.paymentMode,
      );
      if (!finalTxn) {
        finalTxn = await this.paymentTransactionRepository.create(
          {
            refId: paymentOrder.refId,
            userId: paymentOrder.userId,
            orderId: paymentOrder._id,
            amountInPaise:
              webhookData.amountInPaise ?? paymentOrder.amountInPaise,
            paymentMode: mappedPaymentMode,
            provider: paymentOrder.provider,
            providerPaymentId: webhookData.paymentId,
            status: paymentTransactionStatusEnums.PAYMENT_SUCCESS,
            paymentCompletedAt: completionTime,
          },
          session,
        );

        await walletModule.walletService.creditFromPayment(
          {
            userId: paymentOrder.userId.toString(),
            amountInPaise:
              webhookData.amountInPaise ?? paymentOrder.amountInPaise,
            referenceId: paymentOrder.refId,
            provider: paymentOrder.provider,
            providerReferenceId: webhookData.paymentId!,
            idempotencyKey: `wallet-credit-${webhookData.paymentId}`,
            metadata: {
              orderId: paymentOrder._id.toString(),
              transactionId: finalTxn._id.toString(),
              providerOrderId: paymentOrder.providerOrderId,
            },
            createdBy: paymentOrder.userId.toString(),
          },
          session,
        );
      }

      await this.paymentOrderRepository.updateOne({
        refId: paymentOrder.refId,
        payload: {
          providerOrderId: paymentOrder.providerOrderId,
          orderDetails: paymentOrder.orderDetails,
          paymentMode: mappedPaymentMode,
          orderStatus: paymentOrderStatusEnums.ORDER_COMPLETED,
          paymentCompletedAt: completionTime,
        },
        session,
      });

      return {
        paymentOrder,
        transactionId: finalTxn?._id || null,
      };
    };

    const session = await mongoose.startSession();
    let finalizationResult: { paymentOrder: any; transactionId: any } | null =
      null;
    try {
      try {
        await session.withTransaction(async () => {
          finalizationResult = await applyFinalization(session);
        });
      } catch (error: any) {
        const message = String(error?.message || "");
        const transactionUnsupported =
          message.includes(
            "Transaction numbers are only allowed on a replica set member or mongos",
          ) || message.includes("replica set");

        if (!transactionUnsupported) {
          throw error;
        }

        // Fallback for standalone MongoDB in local/dev.
        finalizationResult = await applyFinalization();
      }
    } finally {
      await session.endSession();
    }

    if (finalizationResult?.paymentOrder) {
      const transactionId =
        finalizationResult.transactionId?.toString?.() ??
        finalizationResult.transactionId ??
        null;

      const logOrderResponsePayload: CreateOrderResponseLogDto = {
        refId: finalizationResult.paymentOrder.refId,
        entityType: paymentEntityTypeEnums.ORDER,
        event: paymentEventEnums.ORDER_CREATED,
        operation: paymentLogOperationEnums.CREATE_ORDER,
        provider: finalizationResult.paymentOrder.provider,
        providerOrderId:
          finalizationResult.paymentOrder.providerOrderId || undefined,
        responsePayload: {
          providerOrderId:
            finalizationResult.paymentOrder.providerOrderId || "NA",
          raw: finalizationResult.paymentOrder.orderDetails || {},
        },
        stage: paymentLogStageEnums.RESPONSE,
        status: paymentLogStatusEnums.SUCCESS,
        orderId: finalizationResult.paymentOrder._id,
        transactionId,
      };

      void enqueuePaymentLogJob({
        jobName: paymentLogQueueJobs.CREATE_ORDER_RESPONSE,
        payload: logOrderResponsePayload,
      }).catch((error: unknown) => {
        console.error(
          "enqueue order response log with transactionId failed",
          error,
        );
      });
    }
  }

  async createOrder({
    paymentOrder,
    userId,
  }: {
    paymentOrder: PaymentOrderDto;
    userId: string;
  }) {
    // before creating order check wallet is available or not as we are only allowing payments for wallet credit for now
    await walletModule.walletService.getWallet(userId);
    const paymentOrderCreationResult = await this.paymentOrderRepository.create(
      {
        paymentOrder,
        userId,
      },
    );
    let logOrderRequestPayload: CreateOrderRequestLogDto;
    let logOrderResponsePayload: CreateOrderResponseLogDto;

    logOrderRequestPayload = {
      refId: paymentOrderCreationResult.refId,
      entityType: paymentEntityTypeEnums.ORDER,
      event: paymentEventEnums.ORDER_INITIATED,
      operation: paymentLogOperationEnums.CREATE_ORDER,
      stage: paymentLogStageEnums.REQUEST,
      provider: paymentOrderCreationResult.provider,
      status: paymentLogStatusEnums.PENDING,
      orderId: paymentOrderCreationResult?._id,
      requestPayload: {
        amountInPaise: paymentOrderCreationResult.amountInPaise,
        currency: "INR",
        receipt: paymentOrderCreationResult.refId,
      },
    };

    void enqueuePaymentLogJob({
      jobName: paymentLogQueueJobs.CREATE_ORDER_REQUEST,
      payload: logOrderRequestPayload,
    }).catch((error: any) => console.log(error));

    let providerOrderResponse: any;
    try {
      providerOrderResponse = await this.resolveProvider(
        paymentOrder.provider,
      ).createOrder({
        amountInPaise: paymentOrderCreationResult.amountInPaise,
        receipt: paymentOrderCreationResult.refId,
        currency: "INR",
      });
    } catch (error) {
      try {
        await this.paymentOrderRepository.updateOne({
          refId: paymentOrderCreationResult.refId,
          payload: {
            orderDetails: {},
            providerOrderId: null,
            orderStatus: paymentOrderStatusEnums.ORDER_FAILED,
          },
        });
        logOrderResponsePayload = {
          refId: paymentOrderCreationResult.refId,
          entityType: paymentEntityTypeEnums.ORDER,
          event: paymentEventEnums.ORDER_CREATION_FAILED,
          operation: paymentLogOperationEnums.CREATE_ORDER,
          provider: paymentOrderCreationResult.provider,
          providerOrderId: providerOrderResponse?.id,
          responsePayload: {
            providerOrderId: providerOrderResponse?.id || "NA",
            raw: providerOrderResponse,
          },
          stage: paymentLogStageEnums.RESPONSE,
          status: paymentLogStatusEnums.FAILURE,
          errorCode: providerOrderResponse?.errorCode || 500,
          errorReason:
            providerOrderResponse?.error?.reason || "no valid reason provided",
          orderId: paymentOrderCreationResult?._id,
        };
        void enqueuePaymentLogJob({
          jobName: paymentLogQueueJobs.CREATE_ORDER_RESPONSE,
          payload: logOrderResponsePayload,
        }).catch((error: any) => console.log(error));
      } catch {
        // Preserve the original provider failure.
      }
      throw error;
    }

    const updatedRecord = await this.paymentOrderRepository.updateOne({
      refId: providerOrderResponse.receipt || paymentOrderCreationResult.refId,
      payload: {
        orderDetails: providerOrderResponse,
        providerOrderId: providerOrderResponse.id,
        orderStatus: paymentOrderStatusEnums.ORDER_CREATED,
      },
    });

    if (!updatedRecord) {
      throw new HttpError(
        500,
        "Payment order created at provider but local order update failed",
      );
    }
    logOrderResponsePayload = {
      refId: paymentOrderCreationResult.refId,
      entityType: paymentEntityTypeEnums.ORDER,
      event: paymentEventEnums.ORDER_CREATED,
      operation: paymentLogOperationEnums.CREATE_ORDER,
      provider: paymentOrderCreationResult.provider,
      providerOrderId: providerOrderResponse?.id,
      responsePayload: {
        providerOrderId: providerOrderResponse?.id,
        raw: providerOrderResponse,
      },
      stage: paymentLogStageEnums.RESPONSE,
      status: paymentLogStatusEnums.SUCCESS,
      orderId: paymentOrderCreationResult?._id,
    };
    void enqueuePaymentLogJob({
      jobName: paymentLogQueueJobs.CREATE_ORDER_RESPONSE,
      payload: logOrderResponsePayload,
    }).catch((err: any) => console.log(err));

    return updatedRecord;
  }

  async processWebhook(req: any) {
    let webhookData: any;
    try {
      const provider = this.resolveProviderFromWebhook(req.headers);
      webhookData = await provider.processWebhook(req);

      const isDuplicate = await this.paymentWebhookLogService.isDuplicateEvent(
        webhookData.provider,
        webhookData.eventId,
      );

      if (isDuplicate) {
        return {
          ...webhookData,
          eventState: "ignored",
        };
      }

      if (webhookData.eventState === "processed") {
        await this.finalizePaymentFromWebhook(webhookData);
      }

      void enqueuePaymentWebhookLogJob({
        jobName: paymentWebhookLogQueueJobs.UPSERT,
        payload: webhookData,
      }).catch((error: unknown) => {
        console.error("enqueue webhook log failed", error);
      });

      return webhookData;
    } catch (error: any) {
      void enqueuePaymentWebhookLogJob({
        jobName: paymentWebhookLogQueueJobs.MARK_FAILED,
        payload: {
          provider: webhookData?.provider || paymentProviderEnums.RAZORPAY,
          eventId: webhookData?.eventId || null,
          event: webhookData?.event || undefined,
          rawPayload: webhookData?.rawPayload,
          errorMessage: error?.message || "Webhook processing failed",
        },
      }).catch((enqueueError: unknown) => {
        console.error("enqueue webhook failure log failed", enqueueError);
      });

      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(500, error?.message || "Webhook processing failed");
    }
  }

  async verifyPayment(payload: VerifyPaymentRequestDto): Promise<any> {
    // if paymentid provided then check transactions first
    const transaction =
      await this.paymentTransactionRepository.findByGatewayPaymentId(
        payload.paymentId,
      );
    if (!transaction && payload.orderId) {
      // check order exist or not wiht orderId
      const order = await this.paymentOrderRepository.findByGatewayOrderId(
        payload.orderId,
      );
      if (!order) {
        throw new HttpError(
          404,
          "No transation or payment order record found, please contact support!",
        );
      }
      // if found theck for provider
      const provider = order.provider;
      // validate signature first
      const resolvedSignatureVerification =
        this.resolveProvider(provider).verifyCheckoutSignature(payload);
      if (!resolvedSignatureVerification) {
        throw new HttpError(400, "Invalid provider signature");
      }

      const result =
        await this.resolveProvider(provider).fetchPaymentStatus(payload);
      return result
    }
    return transaction;
    // return this.resolveProvider(payload.paymentProvider);
  }
}
