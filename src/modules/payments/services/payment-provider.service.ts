import { HttpError } from "../../../common/errors/http.error";
import {
  paymentEntityTypeEnums,
  paymentEventEnums,
  paymentLogOperationEnums,
  paymentLogStageEnums,
  paymentLogStatusEnums,
  paymentOrderStatusEnums,
  paymentProviderEnums,
} from "../../../common/enums/payment-gateway.enum";
import { PaymentProviderFactory } from "../factory/payment-provider.factory";
import { PaymentOrderDto } from "../infrastructure/persistence/document/types/payment-order.types";
import { PaymentProvider } from "../interfaces/payment-provider.interface";
import { PaymentOrderRepository } from "../infrastructure/persistence/abstraction/payment-order.repository";
import {
  CreateOrderRequestLogDto,
  CreateOrderResponseLogDto,
} from "../infrastructure/persistence/document/types/payment.logs.types";
import {
  enqueuePaymentLogJob,
  paymentLogQueueJobs,
} from "../queues/producers/payment-log.producer";

export class PaymentProviderService {
  constructor(
    private readonly paymentOrderRepository: PaymentOrderRepository,
  ) {}

  private resolveProvider(type: paymentProviderEnums): PaymentProvider {
    return PaymentProviderFactory.getProvider(type);
  }

  private resolveProviderFromWebhook(headers: any): PaymentProvider {
    return PaymentProviderFactory.getProviderFromWebhook(headers);
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
    try {
      const provider = this.resolveProviderFromWebhook(req.headers);
      const webhookData = provider.verifyWebhook(req);
      return webhookData;
    } catch (error: any) {
      throw new HttpError(500, error?.message);
    }
  }

  async verifyPayment(payload: any): Promise<any> {
    return this.resolveProvider(payload.paymentProvider);
  }
}
