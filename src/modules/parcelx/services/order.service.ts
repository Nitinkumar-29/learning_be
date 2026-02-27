import { HttpError } from "../../../common/errors/http.error";
import { orderStatus } from "../../../common/enums/order.enum";
import { OrderRepository } from "../../orders/infrastructure/persistence/abstraction/order.repository";
import { NonRetryableJobError } from "../errors/job.errors";
import { ParcelXRepository } from "../infrastructure/persistence/abstraction/parcel-x-request.repository";
import { ParcelXResponseRepository } from "../infrastructure/persistence/abstraction/parcel-x-response.repository";
import { ParcelXClient } from "../infrastructure/persistence/http/parcel-x-client";
import { mapOrderToParcelXOrderPayload } from "../mapper/parcel-x-order.mapper";

export class ParcelXOrderService {
  constructor(
    private parcelXRequestRepository: ParcelXRepository,
    private parcelXResponseRepository: ParcelXResponseRepository,
    private orderRepository: OrderRepository,
    private parcelXClient: ParcelXClient,
  ) {}

  async logRequest(requestLog: any): Promise<any> {
    return await this.parcelXRequestRepository.create(requestLog);
  }

  async logResponse(responseLog: any): Promise<any> {
    return await this.parcelXResponseRepository.create(responseLog);
  }

  private buildErrorResponsePayload(error: any, fallbackMessage: string): any {
    try {
      if (typeof error?.message === "string") {
        return JSON.parse(error.message);
      }
    } catch {
      // fall through to generic payload
    }

    return {
      message: error?.message || fallbackMessage,
    };
  }

  private async updateProviderState(
    orderId: string,
    payload: Record<string, unknown>,
  ): Promise<void> {
    await this.orderRepository.updateOne(orderId, payload);
  }

  async processParcelXOrder(orderId: string): Promise<void> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NonRetryableJobError(`Order with id ${orderId} not found`);
    }

    const parcelXPayload = mapOrderToParcelXOrderPayload(order);

    await this.updateProviderState(orderId, {
      providerSyncStatus: "processing",
    });

    const requestLog = await this.logRequest({
      provider: "parcelx",
      operation: "order",
      orderId: order._id,
      idempotencyKey: order.clientOrderId,
      requestPayload: parcelXPayload,
      sentAt: new Date(),
    });

    try {
      const apiResponse = await this.parcelXClient.createOrder(parcelXPayload);
      const responseLog = await this.logResponse({
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
    } catch (error: any) {
      const statusCode = error instanceof HttpError ? error.statusCode : 500;
      const responsePayload = this.buildErrorResponsePayload(
        error,
        "ParcelX order creation failed",
      );

      const failedResponseLog = await this.logResponse({
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

  async processParcelXOrderCancellation(orderId: string): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NonRetryableJobError(`Order with id ${orderId} not found`);
    }

    await this.updateProviderState(orderId, {
      providerSyncStatus: "processing",
    });

    const requestLog = await this.logRequest({
      provider: "parcelx",
      operation: "order",
      orderId,
      idempotencyKey: order.clientOrderId,
      requestPayload: { orderId },
      sentAt: new Date(),
    });

    try {
      const parcelXResponse = await this.parcelXClient.orderCancellation(orderId);
      const responseLog = await this.logResponse({
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
        status: orderStatus.CANCELLED,
        providerSyncStatus: "success",
        parcelxRequestRefId: requestLog._id,
        parcelxResponseRefId: responseLog._id,
      });
    } catch (error: any) {
      const statusCode = error instanceof HttpError ? error.statusCode : 500;
      const responsePayload = this.buildErrorResponsePayload(
        error,
        "ParcelX order cancellation failed",
      );

      const failedResponseLog = await this.logResponse({
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
