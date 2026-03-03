import { Types } from "mongoose";
import { IWarehouse } from "../document/types/warehouse.types";

export abstract class WarehouseRepository {
  abstract create(
    userId: string,
    warehousePayload: Record<string, unknown>,
  ): Promise<IWarehouse>;
  abstract updateOne(
    warehouseId: string | Types.ObjectId,
    payload: Record<string, unknown>,
  ): Promise<IWarehouse | null>;
  abstract findMany({
    basicQuery,
    filters,
  }: {
    basicQuery: { admin: boolean; userId: string | Types.ObjectId };
    filters: { page: number; limit: number };
  }): Promise<IWarehouse[]>;

  abstract totalDocuments(basicQuery: {
    admin: boolean;
    userId: string | Types.ObjectId;
  }): Promise<number>;

  abstract findById(warehouseId: string): Promise<IWarehouse | null>;

  abstract findOne(id: string): Promise<IWarehouse | null>;
}
