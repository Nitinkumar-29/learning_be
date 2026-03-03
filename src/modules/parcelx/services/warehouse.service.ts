import {
  registerParcelXWarehouseSchema,
  RegisterParcelXWarehouseDto,
  CreateParcelXRequestLogDto,
} from "../infrastructure/persistence/document/types/parcelx-log.types";
import { HttpError } from "../../../common/errors/http.error";
import {
  warehouseJobTypeEnums,
  warehouseStatusType,
} from "../../../common/enums/warehouse.enum";
import { ParcelXClient } from "../infrastructure/persistence/http/parcel-x-client";
import { ParcelXWarehouseJobData } from "../queues/warehouse/warehouse.job";
import { ParcelXCommonService } from "./common.service";
import { WarehouseRepository } from "../../warehouse/infrastructure/persistence/abstraction/warehouse.repository";

export class ParcelXWarehouseService {
  constructor(
    private readonly parcelXCommonService: ParcelXCommonService,
    private readonly parcelXClient: ParcelXClient,
    private readonly warehouseRepository: WarehouseRepository,
  ) {}

  async processParcelXWarehouse(
    jobData: ParcelXWarehouseJobData,
  ): Promise<any> {
    if (jobData.type === warehouseJobTypeEnums.REMOVE_WAREHOUSE) {
      return this.processWarehouseRemoval(jobData);
    }
    return this.processRegisterWarehouse(jobData);
  }

  private async processRegisterWarehouse(
    jobData: Extract<
      ParcelXWarehouseJobData,
      { type: warehouseJobTypeEnums.REGISTER_WAREHOUSE }
    >,
  ): Promise<any> {
    const { warehouseId, parcelXPayload } = jobData;
    const parsedPayload: RegisterParcelXWarehouseDto =
      registerParcelXWarehouseSchema.parse(parcelXPayload);

    const requestLog = await this.parcelXCommonService.logRequestIdempotent({
      provider: "parcelx",
      operation: "warehouse",
      idempotencyKey: warehouseId,
      requestPayload: parsedPayload,
      sentAt: new Date(),
    });
    await this.warehouseRepository.updateOne(warehouseId, {
      parcelXStatus: warehouseStatusType.PENDING,
    });

    try {
      const apiResponse =
        await this.parcelXClient.createWarehouse(parsedPayload);
      const responseLog = await this.parcelXCommonService.logResponse({
        requestRefId: requestLog._id,
        provider: "parcelx",
        operation: "warehouse",
        statusCode: apiResponse.statusCode,
        success: apiResponse.statusCode >= 200 && apiResponse.statusCode < 300,
        responsePayload: apiResponse.data,
        receivedAt: new Date(),
      });
      await this.warehouseRepository.updateOne(warehouseId, {
        status: warehouseStatusType.CREATED,
        parcelXStatus: warehouseStatusType.CREATED,
      });

      return { requestLog, responseLog, apiResponse };
    } catch (error: any) {
      const statusCode = error instanceof HttpError ? error.statusCode : 500;
      let responsePayload: unknown = {
        message: "ParcelX request failed",
      };
      if (typeof error?.message === "string") {
        try {
          responsePayload = JSON.parse(error.message);
        } catch {
          responsePayload = { message: error.message };
        }
      }

      const failedResponseLog = await this.parcelXCommonService.logResponse({
        requestRefId: requestLog._id,
        provider: "parcelx",
        operation: "warehouse",
        statusCode,
        success: false,
        responsePayload,
        errorCode: error?.code || null,
        errorMessage:
          typeof error?.message === "string"
            ? error.message
            : "ParcelX request failed",
        receivedAt: new Date(),
      });
      await this.warehouseRepository.updateOne(warehouseId, {
        status: warehouseStatusType.FAILED,
        parcelXStatus: warehouseStatusType.FAILED,
      });

      const message =
        typeof error?.message === "string"
          ? error.message
          : "ParcelX warehouse registration failed";

      throw new HttpError(
        statusCode,
        JSON.stringify({
          warehouseId,
          requestRefId: requestLog._id,
          responseRefId: failedResponseLog?._id,
          message,
          providerError: responsePayload,
        }),
      );
    }
  }

  // remove warehouse on parcelx end too
  private async processWarehouseRemoval(
    jobData: Extract<
      ParcelXWarehouseJobData,
      { type: warehouseJobTypeEnums.REMOVE_WAREHOUSE }
    >,
  ): Promise<any> {
    const { warehouseId } = jobData;
    // log request
    const logRequest = await this.parcelXCommonService.logRequestIdempotent({
      provider: "parcelx",
      operation: "warehouse",
      idempotencyKey: warehouseId,
      requestPayload: warehouseId,
      sentAt: new Date(),
    });
    try {
      // hit parcelx endpoint
      const parcelXApiResponse =
        await this.parcelXClient.removeWarehouse(warehouseId);
      //  log response
      const logResponse = await this.parcelXCommonService.logResponse({
        provider: "parcelx",
        statusCode: parcelXApiResponse.statusCode,
        operation: "warehouse",
        requestRefId: logRequest._id,
        responsePayload: parcelXApiResponse.data,
        success: true,
        receivedAt: new Date(),
      });
      await this.warehouseRepository.updateOne(warehouseId, {
        status: warehouseStatusType.INACTIVE,
        parcelXStatus: warehouseStatusType.INACTIVE,
        previousStatus: null,
        opId: null,
      });

      return {
        warehouseId,
        success: true,
        logResponse,
        message: "Warehouse marked inactive",
      };
    } catch (error: any) {
      const statusCode = error instanceof HttpError ? error.statusCode : 500;
      let responsePayload: unknown = {
        message: "ParcelX request failed",
      };
      if (typeof error?.message === "string") {
        try {
          responsePayload = JSON.parse(error.message);
        } catch {
          responsePayload = { message: error.message };
        }
      }

      const failedResponseLog = await this.parcelXCommonService.logResponse({
        requestRefId: logRequest._id,
        provider: "parcelx",
        operation: "warehouse",
        statusCode,
        success: false,
        responsePayload,
        errorCode: error?.code || null,
        errorMessage:
          typeof error?.message === "string"
            ? error.message
            : "ParcelX request failed",
        receivedAt: new Date(),
      });
      // check warehouse again for previous status
      const warehouseData = await this.warehouseRepository.findOne(warehouseId);
      if (!warehouseData) {
        throw new HttpError(
          404,
          `Warehouse with id ${warehouseId} not found for rollback`,
        );
      }
      // check if opid exist or not
      if (jobData.opId !== warehouseData.opId) {
        throw new HttpError(
          409,
          `Opid not matching... for this ${warehouseId}`,
        );
      }
      await this.warehouseRepository.updateOne(warehouseId, {
        status: warehouseData.previousStatus,
        parcelXStatus: warehouseData.previousStatus,
        previousStatus: null,
        opId: null,
      });

      const message =
        typeof error?.message === "string"
          ? error.message
          : "ParcelX warehouse registration failed";

      throw new HttpError(
        statusCode,
        JSON.stringify({
          warehouseId,
          requestRefId: logRequest._id,
          responseRefId: failedResponseLog?._id,
          message,
          providerError: responsePayload,
        }),
      );
    }
  }
}
