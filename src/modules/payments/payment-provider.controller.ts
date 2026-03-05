import { NextFunction, Request, Response } from "express";
import { PaymentProviderService } from "./services/payment-provider.service";
import { PaymentOrderDto } from "./infrastructure/persistence/document/types/payment-order.types";

export class PaymentGatewayController {
  constructor(private readonly paymentService: PaymentProviderService) {
    this.paymentService = paymentService;
    this.createOrder = this.createOrder.bind(this);
    this.prcoessWebhook = this.prcoessWebhook.bind(this);
    this.verifyPayment = this.verifyPayment.bind(this);
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

  // webhook for provider to hit
  async prcoessWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      // process it
      await this.paymentService.processWebhook(req);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  // verify-payment
  async verifyPayment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      // verify-payment hit service
    } catch (error) {
      next(error);
    }
  }
}
