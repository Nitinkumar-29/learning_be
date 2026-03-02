import { Types } from "mongoose";

export abstract class WarehouseRepository {
  abstract create(userId: string, warehousePayload: any): Promise<any>;
  abstract updateOne(
    warehouseId: string | Types.ObjectId,
    payload: Record<string, unknown>,
  ): Promise<any>;
  abstract findMany({
    basicQuery,
    filters,
  }: {
    basicQuery: { admin: boolean; userId: string | Types.ObjectId };
    filters: { page: number; limit: number };
  }): Promise<any>;

  abstract totalDocuments(basicQuery: {
    admin: boolean;
    userId: string | Types.ObjectId;
  }): Promise<number>;
}
