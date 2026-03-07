"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseService = void 0;
const crypto_1 = require("crypto");
const auth_enum_1 = require("../../common/enums/auth.enum");
const http_error_1 = require("../../common/errors/http.error");
const warehouse_producer_1 = require("../parcelx/queues/warehouse/warehouse.producer");
const parcel_x_warehouse_mapper_1 = require("../parcelx/mapper/parcel-x-warehouse.mapper");
const warehouse_enum_1 = require("../../common/enums/warehouse.enum");
class WarehouseService {
    constructor(warehouseRepository) {
        this.warehouseRepository = warehouseRepository;
    }
    // register warehouse
    async register(userId, payload) {
        const result = await this.warehouseRepository.create(userId, payload);
        if (!result) {
            throw new http_error_1.HttpError(503, "warehouse registration request failed");
        }
        const warehouseRegistrationPayload = (0, parcel_x_warehouse_mapper_1.mapWarehouseParcelXPayload)(payload);
        await warehouse_producer_1.ParcelXWarehouseQueue.add("warehouse-registration", {
            type: warehouse_enum_1.warehouseJobTypeEnums.REGISTER_WAREHOUSE,
            warehouseId: result._id.toString(),
            parcelXPayload: warehouseRegistrationPayload,
            userId,
        }, {
            jobId: `${warehouse_producer_1.parcelXWarehouse}_${result._id.toString()}`,
        });
        return result;
    }
    //   fetch warehouse based on user role
    async getRelativeWarehousesData(userId, role, queryParams) {
        const page = Math.max(1, Number(queryParams.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(queryParams.limit) || 10));
        const basicQuery = {
            admin: role === auth_enum_1.userRole.ADMIN,
            userId,
        };
        const items = await this.warehouseRepository.findMany({
            basicQuery,
            filters: { page, limit },
        });
        const total = await this.warehouseRepository.totalDocuments(basicQuery);
        const totalPages = Math.max(1, Math.ceil(total / limit));
        return {
            items,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        };
    }
    // remove warehouse
    async removeWarehouse(warehouseId) {
        // check whether warehouseId exists or not
        const warehouse = await this.warehouseRepository.findById(warehouseId);
        if (!warehouse) {
            throw new http_error_1.HttpError(404, `Warehouse with this ${warehouseId} id doesn't exists in our system`);
        }
        if (warehouse.status === warehouse_enum_1.warehouseStatusType.INACTIVE) {
            throw new http_error_1.HttpError(409, `Warehouse with this ${warehouseId} id already inactivated!`);
        }
        const currentStatus = warehouse.status ?? warehouse_enum_1.warehouseStatusType.PENDING;
        const opId = `warehouse-removal-${warehouseId}-${(0, crypto_1.randomUUID)()}`;
        // update warehouse
        const updated = await this.warehouseRepository.updateOne(warehouseId, {
            status: warehouse_enum_1.warehouseStatusType.REMOVAL_PENDING,
            previousStatus: currentStatus,
            opId,
        });
        try {
            //  add to queue to process on parcel
            await warehouse_producer_1.ParcelXWarehouseQueue.add("remove-warehouse", {
                type: warehouse_enum_1.warehouseJobTypeEnums.REMOVE_WAREHOUSE,
                warehouseId: warehouseId,
                previousStatus: currentStatus,
                userId: warehouse.userId.toString(),
                opId,
            });
        }
        catch (error) {
            await this.warehouseRepository.updateOne(warehouseId, {
                status: currentStatus,
                previousStatus: null,
                opId: null,
            });
            throw error;
        }
        // return response
        return updated;
    }
}
exports.WarehouseService = WarehouseService;
