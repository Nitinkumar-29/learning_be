import { Types } from "mongoose";
import { WarehouseRepository } from "./infrastructure/persistence/abstraction/warehouse.repository";
import { RegisterWarehouseDto } from "./infrastructure/persistence/document/types/warehouse.types";
import { userRole } from "../../common/enums/auth.enum";
import { HttpError } from "../../common/errors/http.error";
import {
  parcelXWarehouse,
  ParcelXWarehouseQueue,
} from "../parcelx/queues/warehouse/warehouse.producer";
import { mapWarehouseParcelXPayload } from "../parcelx/mapper/parcel-x-warehouse.mapper";

export class WarehouseService {
  constructor(private warehouseRepository: WarehouseRepository) {}

  // register warehouse
  async register(userId: string, payload: RegisterWarehouseDto): Promise<any> {
    const result = await this.warehouseRepository.create(userId, payload);
    if (!result) {
      throw new HttpError(503, "warehouse registration request failed");
    }

    const warehouseRegistrationPayload = mapWarehouseParcelXPayload(payload);
    await ParcelXWarehouseQueue.add("warehouse-registration", {
      warehouseId: result._id.toString(),
      userId,
      parcelXPayload: warehouseRegistrationPayload,
    }, {
      jobId: `${parcelXWarehouse}_${result._id.toString()}`,
    });

    return result;
  }

  //   fetch warehouse based on user role
  async getRelativeWarehousesData(
    userId: string | Types.ObjectId,
    role: string,
    queryParams?: Object,
  ): Promise<any> {
    // if role is admin fetch all warehouses
    let basicQuery;
    if (role === userRole.ADMIN) {
      basicQuery = {
        admin: true,
        userId,
      };
    } else {
      basicQuery = {
        admin: false,
        userId,
      };
    }

    // fetch data now
    const results = await this.warehouseRepository.findMany(basicQuery);
    return results;
  }
}
