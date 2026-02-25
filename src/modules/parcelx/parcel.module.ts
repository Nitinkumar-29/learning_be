import { OrderDocumentRepository } from "../orders/infrastructure/persistence/document/repositories/order-document.repository";
import { ParcelXRequestDocumentRepository } from "./infrastructure/persistence/document/repositories/parcel-x-request-document.repository";
import { ParcelXResponseDocumentRepository } from "./infrastructure/persistence/document/repositories/parcel-x-response-document.repository";
import { ParcelXOrderService } from "./services/order.service";

const parcelXRequestRepository = new ParcelXRequestDocumentRepository();
const parcelXResponseRepository = new ParcelXResponseDocumentRepository();
const orderRepository = new OrderDocumentRepository()
const parcelXOrderService = new ParcelXOrderService(
  parcelXRequestRepository,
  parcelXResponseRepository,
  orderRepository,  
);
export const parcelXModule = {
  parcelXOrderService,
};
