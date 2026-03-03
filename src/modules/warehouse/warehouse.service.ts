import { Types } from "mongoose";
import { randomUUID } from "crypto";
import { WarehouseRepository } from "./infrastructure/persistence/abstraction/warehouse.repository";
import { RegisterWarehouseDto } from "./infrastructure/persistence/document/types/warehouse.types";
import { userRole } from "../../common/enums/auth.enum";
import { HttpError } from "../../common/errors/http.error";
import {
  parcelXWarehouse,
  ParcelXWarehouseQueue,
} from "../parcelx/queues/warehouse/warehouse.producer";
import { mapWarehouseParcelXPayload } from "../parcelx/mapper/parcel-x-warehouse.mapper";
import {
  warehouseJobTypeEnums,
  warehouseStatusType,
} from "../../common/enums/warehouse.enum";

export class WarehouseService {
  constructor(private warehouseRepository: WarehouseRepository) {}

  // register warehouse
  async register(userId: string, payload: RegisterWarehouseDto): Promise<any> {
    const result = await this.warehouseRepository.create(userId, payload);
    if (!result) {
      throw new HttpError(503, "warehouse registration request failed");
    }

    const warehouseRegistrationPayload = mapWarehouseParcelXPayload(payload);
    await ParcelXWarehouseQueue.add(
      "warehouse-registration",
      {
        type: warehouseJobTypeEnums.REGISTER_WAREHOUSE,
        warehouseId: result._id.toString(),
        parcelXPayload: warehouseRegistrationPayload,
        userId,
      },
      {
        jobId: `${parcelXWarehouse}_${result._id.toString()}`,
      },
    );

    return result;
  }

  //   fetch warehouse based on user role
  async getRelativeWarehousesData(
    userId: string | Types.ObjectId,
    role: string,
    queryParams: { page: number; limit: number },
  ): Promise<any> {
    const page = Math.max(1, Number(queryParams.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(queryParams.limit) || 10));
    const basicQuery = {
      admin: role === userRole.ADMIN,
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
  async removeWarehouse(warehouseId: string): Promise<any> {
    // check whether warehouseId exists or not
    const warehouse = await this.warehouseRepository.findById(warehouseId);
    if (!warehouse) {
      throw new HttpError(
        404,
        `Warehouse with this ${warehouseId} id doesn't exists in our system`,
      );
    }
    if (warehouse.status === warehouseStatusType.INACTIVE) {
      throw new HttpError(
        409,
        `Warehouse with this ${warehouseId} id already inactivated!`,
      );
    }
    const currentStatus = warehouse.status ?? warehouseStatusType.PENDING;
    const opId = `warehouse-removal-${warehouseId}-${randomUUID()}`;
    // update warehouse
    const updated = await this.warehouseRepository.updateOne(warehouseId, {
      status: warehouseStatusType.REMOVAL_PENDING,
      previousStatus: currentStatus,
      opId,
    });
    try {
      //  add to queue to process on parcel
      await ParcelXWarehouseQueue.add("remove-warehouse", {
        type: warehouseJobTypeEnums.REMOVE_WAREHOUSE,
        warehouseId: warehouseId,
        previousStatus: currentStatus,
        userId: warehouse.userId.toString(),
        opId,
      });
    } catch (error) {
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
