import { Types } from "mongoose";
import { WarehouseRepository } from "../../abstraction/warehouse.repository";
import { warehouseModel } from "../schemas/warehouse.schema";

export class WarehouseDocumentRepository implements WarehouseRepository {
  async create(userId: string, warehousePayload: any): Promise<any> {
    return await warehouseModel.create({ userId, ...warehousePayload });
  }

  async updateOne(
    warehouseId: string | Types.ObjectId,
    payload: Record<string, unknown>,
  ): Promise<any> {
    return await warehouseModel.findByIdAndUpdate(warehouseId, payload, {
      new: true,
    });
  }

  async findById(warehouseId: string | Types.ObjectId): Promise<any> {
    return await warehouseModel.findById(warehouseId);
  }

  async findMany(basicQuery: {
    admin: boolean;
    userId: Types.ObjectId;
  }): Promise<any> {
    let result;
    if (basicQuery.admin) {
      result = await warehouseModel.find({});
    } else {
      result = await warehouseModel.find({ userId: basicQuery.userId });
    }
    return result;
  }
}
