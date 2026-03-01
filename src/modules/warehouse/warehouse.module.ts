import { WarehouseDocumentRepository } from "./infrastructure/persistence/document/repositories/warehouse.document.repository";
import { WarehouseController } from "./warehouse.controller";
import { WarehouseService } from "./warehouse.service";

// initiate other required instances
const warehouseDocumentRepository = new WarehouseDocumentRepository();
const warehouseService = new WarehouseService(warehouseDocumentRepository);
const warehouseController = new WarehouseController(warehouseService);

export const warehouseModule = {
  warehouseController,
  warehouseService,
};
