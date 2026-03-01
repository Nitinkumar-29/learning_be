import { createParcelXQueue } from "../queue.factory";
import { RegisterParcelXWarehouseDto } from "../../infrastructure/persistence/document/types/parcelx-log.types";
// export tpye job payload
export const parcelXWarehouse = "parcelx-warehouse-queue";

export type ParcelXWarehouseJobData = {
  warehouseId: string;
  parcelXPayload: RegisterParcelXWarehouseDto;
  userId: string;
};

export const ParcelXWarehouseQueue =
  createParcelXQueue<ParcelXWarehouseJobData>(parcelXWarehouse);
