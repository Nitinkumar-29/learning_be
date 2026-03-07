"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentGatewayController = void 0;
class PaymentGatewayController {
    constructor(paymentService) {
        this.paymentService = paymentService;
        this.paymentService = paymentService;
        this.createOrder = this.createOrder.bind(this);
        this.prcoessWebhook = this.prcoessWebhook.bind(this);
        this.verifyPayment = this.verifyPayment.bind(this);
    }
    // create order
    async createOrder(req, res, next) {
        try {
            // order payload
            const orderPayload = req.body;
            const userId = req.user.id;
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
        }
        catch (error) {
            next(error);
        }
    }
    // webhook for provider to hit
    async prcoessWebhook(req, res, next) {
        try {
            // process it
            await this.paymentService.processWebhook(req);
            res.json({ success: true });
        }
        catch (error) {
            next(error);
        }
    }
    // verify-payment
    async verifyPayment(req, res, next) {
        try {
            const payload = req.body;
            const result = await this.paymentService.verifyPayment(payload);
            res.status(200).json({
                message: "Payment completed successfully!",
                success: true,
                data: result,
            });
            // verify-payment hit service
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PaymentGatewayController = PaymentGatewayController;
