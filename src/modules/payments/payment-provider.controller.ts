import { NextFunction, Request, Response } from "express";
import { PaymentProviderService } from "./services/payment-provider.service";
import { PaymentOrderDto } from "./infrastructure/persistence/document/types/payment-order.types";

export class PaymentGatewayController {
  constructor(private readonly paymentService: PaymentProviderService) {
    ((this.paymentService = paymentService),
      (this.createOrder = this.createOrder.bind(this)));
  }

  // create order
  async createOrder(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      // order payload
      const orderPayload: PaymentOrderDto = req.body;
      const userId = req.user!.id as unknown as string;
      // request service
      const paymentOrderResult = await this.paymentService.createOrder({
        paymentOrder: orderPayload,
        userId,
      });
      res.status(201).json({
        messsage: "Order generated successfully!",
        success: true,
        data: paymentOrderResult,
      });
    } catch (error) {
      next(error);
    }
  }
}
