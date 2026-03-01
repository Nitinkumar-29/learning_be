import {
  registerParcelXWarehouseSchema,
  RegisterParcelXWarehouseDto,
} from "../infrastructure/persistence/document/types/parcelx-log.types";
import { HttpError } from "../../../common/errors/http.error";
import { warehouseStatusType } from "../../../common/enums/warehouse.enum";
import { ParcelXClient } from "../infrastructure/persistence/http/parcel-x-client";
import { ParcelXWarehouseJobData } from "../queues/warehouse/warehouse.producer";
import { ParcelXCommonService } from "./common.service";
import { WarehouseRepository } from "../../warehouse/infrastructure/persistence/abstraction/warehouse.repository";

export class ParcelXWarehouseService {
  constructor(
    private readonly parcelXCommonService: ParcelXCommonService,
    private readonly parcelXClient: ParcelXClient,
    private readonly warehouseRepository: WarehouseRepository,
  ) {}

  // register warehouse
  async registerParcelXWarehouse(jobData: ParcelXWarehouseJobData): Promise<any> {
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
      const apiResponse = await this.parcelXClient.createWarehouse(parsedPayload);
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
}
