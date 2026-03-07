"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warehouseModule = void 0;
const warehouse_document_repository_1 = require("./infrastructure/persistence/document/repositories/warehouse.document.repository");
const warehouse_controller_1 = require("./warehouse.controller");
const warehouse_service_1 = require("./warehouse.service");
// initiate other required instances
const warehouseDocumentRepository = new warehouse_document_repository_1.WarehouseDocumentRepository();
const warehouseService = new warehouse_service_1.WarehouseService(warehouseDocumentRepository);
const warehouseController = new warehouse_controller_1.WarehouseController(warehouseService);
exports.warehouseModule = {
    warehouseController,
    warehouseService,
};
