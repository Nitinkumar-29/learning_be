import { Types } from "mongoose";
import { WarehouseRepository } from "../../abstraction/warehouse.repository";
import { warehouseModel } from "../schemas/warehouse.schema";
import { IWarehouse } from "../types/warehouse.types";

export class WarehouseDocumentRepository implements WarehouseRepository {
  async create(
    userId: string,
    warehousePayload: Record<string, unknown>,
  ): Promise<IWarehouse> {
    return await warehouseModel.create({ userId, ...warehousePayload });
  }

  async updateOne(
    warehouseId: string | Types.ObjectId,
    payload: Record<string, unknown>,
  ): Promise<IWarehouse | null> {
    return await warehouseModel.findByIdAndUpdate(warehouseId, payload, {
      new: true,
    });
  }

  async findOne(id: string): Promise<IWarehouse | null> {
    return await warehouseModel.findOne({ _id: id });
  }

  async findById(warehouseId: string | Types.ObjectId): Promise<IWarehouse | null> {
    return await warehouseModel.findById(warehouseId);
  }

  async findMany({
    basicQuery,
    filters,
  }: {
    basicQuery: { admin: boolean; userId: string | Types.ObjectId };
    filters: { page: number; limit: number };
  }): Promise<IWarehouse[]> {
    const page = Math.max(1, Number(filters?.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filters?.limit) || 10));
    const skip = (page - 1) * limit;
    const query = basicQuery.admin ? {} : { userId: basicQuery.userId };

    return await warehouseModel
      .find(query)
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit);
  }

  async totalDocuments(basicQuery: {
    admin: boolean;
    userId: string | Types.ObjectId;
  }): Promise<number> {
    const query = basicQuery.admin ? {} : { userId: basicQuery.userId };
    return await warehouseModel.countDocuments(query);
  }
}
