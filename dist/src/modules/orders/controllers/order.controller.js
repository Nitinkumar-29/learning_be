"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
        this.orderService = orderService;
        this.createOrder = this.createOrder.bind(this);
        this.cancelOrder = this.cancelOrder.bind(this);
    }
    // create order
    async createOrder(req, res, next) {
        try {
            const orderPayload = req.body;
            const userId = req.user?.id;
            const { order, idempotentReplay } = await this.orderService.createOrder(orderPayload, userId);
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
        }
        catch (error) {
            next(error);
        }
    }
    async cancelOrder(req, res, next) {
        try {
            const orderRequestCancellationPayload = req.body;
            const result = await this.orderService.cancelOrder(orderRequestCancellationPayload);
            res.status(200).json({
                message: "Order cancellation successful",
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.OrderController = OrderController;
