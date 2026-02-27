import { orderStatus } from "../../../common/enums/order.enum";
import { HttpError } from "../../../common/errors/http.error";
import {
  CreateOrderDto,
  OrderCancellationRequestDto,
} from "../infrastructure/persistence/document/types/order.type";
import { OrderRepository } from "../infrastructure/persistence/abstraction/order.repository";
import { parcelXOrderCancellationQueue, parcelXOrderQueue } from "../../parcelx/queues/order/order.producer";

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

  async cancelOrder(payload: OrderCancellationRequestDto) {
    // to cancel the order i need to first get response from parcelx to confirm cnacellation thne update order details
    const order = await this.orderRepository.findById(payload.orderId);
    if (!order) {
      throw new HttpError(404, "Order not found");
    }
    if (order.status === orderStatus.CANCELLED) {
      throw new HttpError(400, "Order is already cancelled");
    }
    await parcelXOrderCancellationQueue.add("cancel-order", {
      orderId: payload.orderId,
      cancellationReason:payload.reason,
      userId: order.userId,
      clientOrderId: order.clientOrderId,
    });
    //  send response
    return {
      message: "Order cancellation request has been queued for processing",
      success: true,
      data: {
        orderId: payload.orderId,
        reason: payload.reason,
        clientOrderId: payload.clientOrderId || null,
      },
    };
  }

  private generateOrderNumber(): string {
    const timePart = Date.now().toString().slice(-8);
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `ORD-${timePart}-${randomPart}`;
  }
}
