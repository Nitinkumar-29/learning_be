"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parcelXModule = void 0;
const order_document_repository_1 = require("../orders/infrastructure/persistence/document/repositories/order-document.repository");
const parcel_x_client_1 = require("./infrastructure/persistence/http/parcel-x-client");
const parcel_x_request_document_repository_1 = require("./infrastructure/persistence/document/repositories/parcel-x-request-document.repository");
const parcel_x_response_document_repository_1 = require("./infrastructure/persistence/document/repositories/parcel-x-response-document.repository");
const order_service_1 = require("./services/order.service");
const common_service_1 = require("./services/common.service");
const warehouse_service_1 = require("./services/warehouse.service");
const warehouse_document_repository_1 = require("../warehouse/infrastructure/persistence/document/repositories/warehouse.document.repository");
const parcelXRequestRepository = new parcel_x_request_document_repository_1.ParcelXRequestDocumentRepository();
const parcelXResponseRepository = new parcel_x_response_document_repository_1.ParcelXResponseDocumentRepository();
const parcelXCommonService = new common_service_1.ParcelXCommonService(parcelXRequestRepository, parcelXResponseRepository);
const orderRepository = new order_document_repository_1.OrderDocumentRepository();
const warehouseRepository = new warehouse_document_repository_1.WarehouseDocumentRepository();
const parcelXClient = new parcel_x_client_1.ParcelXClient();
const parcelXOrderService = new order_service_1.ParcelXOrderService(orderRepository, parcelXClient, parcelXCommonService);
const parcelXWarehouseService = new warehouse_service_1.ParcelXWarehouseService(parcelXCommonService, parcelXClient, warehouseRepository);
exports.parcelXModule = {
    parcelXOrderService,
    parcelXWarehouseService,
};
