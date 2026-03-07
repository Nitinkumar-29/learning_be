"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const order_enum_1 = require("../../../common/enums/order.enum");
const http_error_1 = require("../../../common/errors/http.error");
const order_producer_1 = require("../../parcelx/queues/order/order.producer");
class OrderService {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
    // create order and enqueue for ParcelX processing
    async createOrder(orderPayload, userId) {
        if (!userId) {
            throw new http_error_1.HttpError(401, "Unauthorized user");
        }
        if (orderPayload.clientOrderId) {
            const existingOrder = await this.orderRepository.findByUserAndClientOrderId(userId, orderPayload.clientOrderId);
            if (existingOrder) {
                return {
                    order: existingOrder,
                    idempotentReplay: true,
                };
            }
        }
        const orderNumber = this.generateOrderNumber();
        const totalAmount = orderPayload.charges.orderAmount +
            orderPayload.charges.codAmount +
            orderPayload.charges.taxAmount +
            orderPayload.charges.extraCharges;
        const orderToCreate = {
            userId,
            orderNumber,
            clientOrderId: orderPayload.clientOrderId || null,
            status: order_enum_1.orderStatus.PENDING,
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
        await order_producer_1.parcelXOrderQueue.add("create-order", {
            orderId: createdOrder._id.toString(),
            userId,
            clientOrderId: orderPayload.clientOrderId || undefined,
        });
        return {
            order: createdOrder,
            idempotentReplay: false,
        };
    }
    async cancelOrder(payload) {
        // to cancel the order i need to first get response from parcelx to confirm cnacellation thne update order details
        const order = await this.orderRepository.findById(payload.orderId);
        if (!order) {
            throw new http_error_1.HttpError(404, "Order not found");
        }
        if (order.status === order_enum_1.orderStatus.CANCELLED) {
            throw new http_error_1.HttpError(400, "Order is already cancelled");
        }
        await order_producer_1.parcelXOrderCancellationQueue.add("cancel-order", {
            orderId: payload.orderId,
            cancellationReason: payload.reason,
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
    generateOrderNumber() {
        const timePart = Date.now().toString().slice(-8);
        const randomPart = Math.floor(1000 + Math.random() * 9000);
        return `ORD-${timePart}-${randomPart}`;
    }
}
exports.OrderService = OrderService;
