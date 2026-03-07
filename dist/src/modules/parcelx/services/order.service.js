"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelXOrderService = void 0;
const http_error_1 = require("../../../common/errors/http.error");
const order_enum_1 = require("../../../common/enums/order.enum");
const job_errors_1 = require("../errors/job.errors");
const parcel_x_order_mapper_1 = require("../mapper/parcel-x-order.mapper");
class ParcelXOrderService {
    constructor(orderRepository, parcelXClient, parcelXCommonService) {
        this.orderRepository = orderRepository;
        this.parcelXClient = parcelXClient;
        this.parcelXCommonService = parcelXCommonService;
    }
    buildErrorResponsePayload(error, fallbackMessage) {
        try {
            if (typeof error?.message === "string") {
                return JSON.parse(error.message);
            }
        }
        catch {
            // fall through to generic payload
        }
        return {
            message: error?.message || fallbackMessage,
        };
    }
    async updateProviderState(orderId, payload) {
        await this.orderRepository.updateOne(orderId, payload);
    }
    async processParcelXOrder(orderId) {
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new job_errors_1.NonRetryableJobError(`Order with id ${orderId} not found`);
        }
        const parcelXPayload = (0, parcel_x_order_mapper_1.mapOrderToParcelXOrderPayload)(order);
        await this.updateProviderState(orderId, {
            providerSyncStatus: "processing",
        });
        const requestLog = await this.parcelXCommonService.logRequest({
            provider: "parcelx",
            operation: "order",
            orderId: order._id,
            idempotencyKey: order.clientOrderId,
            requestPayload: parcelXPayload,
            sentAt: new Date(),
        });
        try {
            const apiResponse = await this.parcelXClient.createOrder(parcelXPayload);
            const responseLog = await this.parcelXCommonService.logResponse({
                requestRefId: requestLog._id,
                provider: "parcelx",
                operation: "order",
                orderId: order._id,
                statusCode: apiResponse.statusCode,
                success: apiResponse.statusCode >= 200 && apiResponse.statusCode < 300,
                responsePayload: apiResponse.data,
                receivedAt: new Date(),
            });
            await this.updateProviderState(orderId, {
                providerSyncStatus: "success",
                parcelxRequestRefId: requestLog._id,
                parcelxResponseRefId: responseLog._id,
            });
        }
        catch (error) {
            const statusCode = error instanceof http_error_1.HttpError ? error.statusCode : 500;
            const responsePayload = this.buildErrorResponsePayload(error, "ParcelX order creation failed");
            const failedResponseLog = await this.parcelXCommonService.logResponse({
                requestRefId: requestLog._id,
                provider: "parcelx",
                operation: "order",
                orderId: order._id,
                statusCode,
                success: false,
                responsePayload,
                errorCode: error?.code || null,
                errorMessage: error?.message || "ParcelX request failed",
                receivedAt: new Date(),
            });
            await this.updateProviderState(orderId, {
                providerSyncStatus: "failed",
                parcelxRequestRefId: requestLog._id,
                parcelxResponseRefId: failedResponseLog._id,
            });
            throw error;
        }
    }
    async processParcelXOrderCancellation(orderId) {
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new job_errors_1.NonRetryableJobError(`Order with id ${orderId} not found`);
        }
        await this.updateProviderState(orderId, {
            providerSyncStatus: "processing",
        });
        const requestLog = await this.parcelXCommonService.logRequest({
            provider: "parcelx",
            operation: "order",
            orderId,
            idempotencyKey: order.clientOrderId,
            requestPayload: { orderId },
            sentAt: new Date(),
        });
        try {
            const parcelXResponse = await this.parcelXClient.orderCancellation(orderId);
            const responseLog = await this.parcelXCommonService.logResponse({
                requestRefId: requestLog._id,
                provider: "parcelx",
                operation: "order",
                orderId,
                statusCode: parcelXResponse.statusCode,
                success: parcelXResponse.statusCode >= 200 && parcelXResponse.statusCode < 300,
                responsePayload: parcelXResponse.data,
                receivedAt: new Date(),
            });
            await this.updateProviderState(orderId, {
                status: order_enum_1.orderStatus.CANCELLED,
                providerSyncStatus: "success",
                parcelxRequestRefId: requestLog._id,
                parcelxResponseRefId: responseLog._id,
            });
        }
        catch (error) {
            const statusCode = error instanceof http_error_1.HttpError ? error.statusCode : 500;
            const responsePayload = this.buildErrorResponsePayload(error, "ParcelX order cancellation failed");
            const failedResponseLog = await this.parcelXCommonService.logResponse({
                requestRefId: requestLog._id,
                provider: "parcelx",
                operation: "order",
                orderId: order._id,
                statusCode,
                success: false,
                responsePayload,
                errorCode: error?.code || null,
                errorMessage: error?.message || "ParcelX request failed",
                receivedAt: new Date(),
            });
            await this.updateProviderState(orderId, {
                providerSyncStatus: "failed",
                parcelxRequestRefId: requestLog._id,
                parcelxResponseRefId: failedResponseLog._id,
            });
            throw error;
        }
    }
}
exports.ParcelXOrderService = ParcelXOrderService;
