import { HttpError } from "../../../common/errors/http.error";
import {
  paymentEntityTypeEnums,
  paymentEventEnums,
  paymentLogOperationEnums,
  paymentLogStageEnums,
  paymentLogStatusEnums,
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
import {
  enqueuePaymentLogJob,
  paymentLogQueueJobs,
} from "../queues/producers/payment-log.producer";
import {
  enqueuePaymentWebhookLogJob,
  paymentWebhookLogQueueJobs,
} from "../queues/producers/payment-webhook-log.producer";
import { PaymentWebhookLogService } from "./payment-webhook-log.service";

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

  private async finalizePaymentFromWebhook(webhookData: {
    event: string;
    providerOrderId: string | null;
    paymentId: string | null;
    amountInPaise: number | null;
  }): Promise<void> {
    if (!this.isTerminalWebhookEvent(webhookData.event)) {
      return;
    }

    if (!webhookData.providerOrderId || !webhookData.paymentId) {
      return;
    }

    const paymentOrder = await this.paymentOrderRepository.findByGatewayOrderId(
      webhookData.providerOrderId,
    );

    if (!paymentOrder) {
      throw new HttpError(404, "Payment order not found for webhook event");
    }

    const existingTxn =
      await this.paymentTransactionRepository.findByGatewayPaymentId(
        webhookData.paymentId,
      );

    if (!existingTxn) {
      await this.paymentTransactionRepository.create({
        refId: paymentOrder.refId,
        userId: paymentOrder.userId,
        orderId: paymentOrder._id,
        amountInPaise: webhookData.amountInPaise ?? paymentOrder.amountInPaise,
        paymentMode: paymentOrder.paymentMode,
        provider: paymentOrder.provider,
        providerPaymentId: webhookData.paymentId,
        status: paymentTransactionStatusEnums.PAYMENT_SUCCESS,
        paymentCompletedAt: new Date(),
      });
    }

    await this.paymentOrderRepository.updateOne({
      refId: paymentOrder.refId,
      payload: {
        providerOrderId: paymentOrder.providerOrderId,
        orderDetails: paymentOrder.orderDetails,
        orderStatus: paymentOrderStatusEnums.ORDER_COMPLETED,
        paymentCompletedAt: new Date(),
      },
    });
  }

  async createOrder({
    paymentOrder,
    userId,
  }: {
    paymentOrder: PaymentOrderDto;
    userId: string;
  }) {
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

  async verifyPayment(payload: any): Promise<any> {
    return this.resolveProvider(payload.paymentProvider);
  }
}
