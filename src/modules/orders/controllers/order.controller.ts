import { NextFunction, Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { CreateOrderDto } from "../infrastructure/persistence/document/types/order.type";

export class OrderController {
  constructor(private orderService: OrderService) {
    this.orderService = orderService;
    this.createOrder = this.createOrder.bind(this);
  }

  // create order
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const orderPayload = req.body as CreateOrderDto;
      const userId = req.user?.id as unknown as string;
      const { order, idempotentReplay } = await this.orderService.createOrder(
        orderPayload,
        userId,
      );
      res.status(idempotentReplay ? 200 : 201).json({
        message: idempotentReplay
          ? "Duplicate request detected. Returning existing order"
          : "Order accepted and queued for provider creation",
        success: true,
        idempotentReplay,
        data: {
          id: order._id,
          orderNumber: order.orderNumber,
          clientOrderId: order.clientOrderId,
          status: order.status,
          providerSyncStatus: order.providerSyncStatus,
          parcelxRequestRefId: order.parcelxRequestRefId,
          parcelxResponseRefId: order.parcelxResponseRefId,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
