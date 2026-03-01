import { Types } from "mongoose";

export abstract class WarehouseRepository {
  abstract create(userId: string, warehousePayload: any): Promise<any>;
  abstract updateOne(
    warehouseId: string | Types.ObjectId,
    payload: Record<string, unknown>,
  ): Promise<any>;
  abstract findMany(basicQuery: {
    admin: boolean;
    userId: string | Types.ObjectId;
  }): Promise<any>;
}
