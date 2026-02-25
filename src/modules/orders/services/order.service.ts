import { orderStatus } from "../../../common/enums/order.enum";
import { HttpError } from "../../../common/errors/http.error";
import { CreateOrderDto } from "../infrastructure/persistence/document/types/order.type";
import { OrderRepository } from "../infrastructure/persistence/abstraction/order.repository";
import { parcelXOrderQueue } from "../../parcelx/queues/order/order.producer";

export class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  // create order and enqueue for ParcelX processing
  async createOrder(
    orderPayload: CreateOrderDto,
    userId: string,
  ): Promise<{ order: any; idempotentReplay: boolean }> {
    if (!userId) {
      throw new HttpError(401, "Unauthorized user");
    }

    if (orderPayload.clientOrderId) {
      const existingOrder =
        await this.orderRepository.findByUserAndClientOrderId(
          userId,
          orderPayload.clientOrderId,
        );
      if (existingOrder) {
        return {
          order: existingOrder,
          idempotentReplay: true,
        };
      }
    }

    const orderNumber = this.generateOrderNumber();
    const totalAmount =
      orderPayload.charges.orderAmount +
      orderPayload.charges.codAmount +
      orderPayload.charges.taxAmount +
      orderPayload.charges.extraCharges;

    const orderToCreate = {
      userId,
      orderNumber,
      clientOrderId: orderPayload.clientOrderId || null,
      status: orderStatus.PENDING,
      paymentMethod: orderPayload.paymentMethod,
      expressType: orderPayload.expressType,
      invoiceNumber: orderPayload.invoiceNumber,
      pickAddressId: orderPayload.pickAddressId,
      returnAddressId: orderPayload.returnAddressId || null,
      consignee: orderPayload.consignee,
      items: orderPayload.items,
      shipment: orderPayload.shipment,
      charges: {
        ...orderPayload.charges,
        totalAmount,
      },
      providerSyncStatus: "queued",
      parcelxRequestRefId: null,
      parcelxResponseRefId: null,
      requestSnapshot: orderPayload,
    };
    // create a entry first before enqueuing to ensure we have an orderId to reference in the queue
    const createdOrder = await this.orderRepository.create(orderToCreate);
    // Enqueue for ParcelX processing
    await parcelXOrderQueue.add("create-order", {
      orderId: createdOrder._id.toString(),
      userId,
      clientOrderId: orderPayload.clientOrderId || undefined,
    });
    return {
      order: createdOrder,
      idempotentReplay: false,
    };
  }

  private generateOrderNumber(): string {
    const timePart = Date.now().toString().slice(-8);
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `ORD-${timePart}-${randomPart}`;
  }
}
