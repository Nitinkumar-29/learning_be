"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelXWarehouseService = void 0;
const parcelx_log_types_1 = require("../infrastructure/persistence/document/types/parcelx-log.types");
const http_error_1 = require("../../../common/errors/http.error");
const warehouse_enum_1 = require("../../../common/enums/warehouse.enum");
class ParcelXWarehouseService {
    constructor(parcelXCommonService, parcelXClient, warehouseRepository) {
        this.parcelXCommonService = parcelXCommonService;
        this.parcelXClient = parcelXClient;
        this.warehouseRepository = warehouseRepository;
    }
    async processParcelXWarehouse(jobData) {
        if (jobData.type === warehouse_enum_1.warehouseJobTypeEnums.REMOVE_WAREHOUSE) {
            return this.processWarehouseRemoval(jobData);
        }
        return this.processRegisterWarehouse(jobData);
    }
    async processRegisterWarehouse(jobData) {
        const { warehouseId, parcelXPayload } = jobData;
        const parsedPayload = parcelx_log_types_1.registerParcelXWarehouseSchema.parse(parcelXPayload);
        const requestLog = await this.parcelXCommonService.logRequestIdempotent({
            provider: "parcelx",
            operation: "warehouse",
            idempotencyKey: warehouseId,
            requestPayload: parsedPayload,
            sentAt: new Date(),
        });
        await this.warehouseRepository.updateOne(warehouseId, {
            parcelXStatus: warehouse_enum_1.warehouseStatusType.PENDING,
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
                status: warehouse_enum_1.warehouseStatusType.CREATED,
                parcelXStatus: warehouse_enum_1.warehouseStatusType.CREATED,
            });
            return { requestLog, responseLog, apiResponse };
        }
        catch (error) {
            const statusCode = error instanceof http_error_1.HttpError ? error.statusCode : 500;
            let responsePayload = {
                message: "ParcelX request failed",
            };
            if (typeof error?.message === "string") {
                try {
                    responsePayload = JSON.parse(error.message);
                }
                catch {
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
                errorMessage: typeof error?.message === "string"
                    ? error.message
                    : "ParcelX request failed",
                receivedAt: new Date(),
            });
            await this.warehouseRepository.updateOne(warehouseId, {
                status: warehouse_enum_1.warehouseStatusType.FAILED,
                parcelXStatus: warehouse_enum_1.warehouseStatusType.FAILED,
            });
            const message = typeof error?.message === "string"
                ? error.message
                : "ParcelX warehouse registration failed";
            throw new http_error_1.HttpError(statusCode, JSON.stringify({
                warehouseId,
                requestRefId: requestLog._id,
                responseRefId: failedResponseLog?._id,
                message,
                providerError: responsePayload,
            }));
        }
    }
    // remove warehouse on parcelx end too
    async processWarehouseRemoval(jobData) {
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
            const parcelXApiResponse = await this.parcelXClient.removeWarehouse(warehouseId);
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
                status: warehouse_enum_1.warehouseStatusType.INACTIVE,
                parcelXStatus: warehouse_enum_1.warehouseStatusType.INACTIVE,
                previousStatus: null,
                opId: null,
            });
            return {
                warehouseId,
                success: true,
                logResponse,
                message: "Warehouse marked inactive",
            };
        }
        catch (error) {
            const statusCode = error instanceof http_error_1.HttpError ? error.statusCode : 500;
            let responsePayload = {
                message: "ParcelX request failed",
            };
            if (typeof error?.message === "string") {
                try {
                    responsePayload = JSON.parse(error.message);
                }
                catch {
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
                errorMessage: typeof error?.message === "string"
                    ? error.message
                    : "ParcelX request failed",
                receivedAt: new Date(),
            });
            // check warehouse again for previous status
            const warehouseData = await this.warehouseRepository.findOne(warehouseId);
            if (!warehouseData) {
                throw new http_error_1.HttpError(404, `Warehouse with id ${warehouseId} not found for rollback`);
            }
            // check if opid exist or not
            if (jobData.opId !== warehouseData.opId) {
                throw new http_error_1.HttpError(409, `Opid not matching... for this ${warehouseId}`);
            }
            await this.warehouseRepository.updateOne(warehouseId, {
                status: warehouseData.previousStatus,
                parcelXStatus: warehouseData.previousStatus,
                previousStatus: null,
                opId: null,
            });
            const message = typeof error?.message === "string"
                ? error.message
                : "ParcelX warehouse registration failed";
            throw new http_error_1.HttpError(statusCode, JSON.stringify({
                warehouseId,
                requestRefId: logRequest._id,
                responseRefId: failedResponseLog?._id,
                message,
                providerError: responsePayload,
            }));
        }
    }
}
exports.ParcelXWarehouseService = ParcelXWarehouseService;
