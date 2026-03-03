import { HttpError } from "../../../common/errors/http.error";
import { paymentOrderStatusEnums, paymentProviderEnums } from "../../../common/enums/payment-gateway.enum";
import { PaymentProviderFactory } from "../factory/payment-provider.factory";
import { PaymentOrderDto } from "../infrastructure/persistence/document/types/payment-order.types";
import { PaymentProvider } from "../interfaces/payment-provider.interface";
import { PaymentOrderRepository } from "../infrastructure/persistence/abstraction/payment-order.repository";

export class PaymentProviderService {
  constructor(private readonly paymentOrderRepository: PaymentOrderRepository){}

  private resolveProvider(type: paymentProviderEnums): PaymentProvider {
    return PaymentProviderFactory.getProvider(type);
  }

  async createOrder({
    paymentOrder,
    userId,
  }: {
    paymentOrder: PaymentOrderDto;
    userId: string;
  }) {
    const paymentOrderCreationResult = await this.paymentOrderRepository.create({
      paymentOrder,
      userId,
    });

    let providerOrderResponse: any;
    try {
      providerOrderResponse = await this.resolveProvider(
        paymentOrder.paymentProvider,
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

    return updatedRecord;
  }

  async verifyWebhook(
    providerType: paymentProviderEnums,
    payload: any,
    signature: string,
  ) {
    return this.resolveProvider(providerType).verifyWebhook(payload, signature);
  }

  async fetchPaymentStatus(
    paymentProvider: paymentProviderEnums,
    orderId: string,
  ) {
    return this.resolveProvider(paymentProvider).fetchPaymentStatus(orderId);
  }
}
