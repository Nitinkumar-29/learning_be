import { createParcelXQueue } from "../queue.factory";
import { ParcelXWarehouseJobData } from "./warehouse.job";
// export tpye job payload
export const parcelXWarehouse = "parcelx-warehouse-queue";

export const ParcelXWarehouseQueue =
  createParcelXQueue<ParcelXWarehouseJobData>(parcelXWarehouse);
