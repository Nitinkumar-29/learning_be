import { OrderDocumentRepository } from "../orders/infrastructure/persistence/document/repositories/order-document.repository";
import { ParcelXClient } from "./infrastructure/persistence/http/parcel-x-client";
import { ParcelXRequestDocumentRepository } from "./infrastructure/persistence/document/repositories/parcel-x-request-document.repository";
import { ParcelXResponseDocumentRepository } from "./infrastructure/persistence/document/repositories/parcel-x-response-document.repository";
import { ParcelXOrderService } from "./services/order.service";
import { ParcelXCommonService } from "./services/common.service";
import { ParcelXWarehouseService } from "./services/warehouse.service";
import { WarehouseDocumentRepository } from "../warehouse/infrastructure/persistence/document/repositories/warehouse.document.repository";

const parcelXRequestRepository = new ParcelXRequestDocumentRepository();
const parcelXResponseRepository = new ParcelXResponseDocumentRepository();
const parcelXCommonService = new ParcelXCommonService(
  parcelXRequestRepository,
  parcelXResponseRepository,
);
const orderRepository = new OrderDocumentRepository();
const warehouseRepository = new WarehouseDocumentRepository();
const parcelXClient = new ParcelXClient();
const parcelXOrderService = new ParcelXOrderService(
  orderRepository,
  parcelXClient,
  parcelXCommonService,
);

const parcelXWarehouseService = new ParcelXWarehouseService(
  parcelXCommonService,
  parcelXClient,
  warehouseRepository,
);
export const parcelXModule = {
  parcelXOrderService,
  parcelXWarehouseService,
};
