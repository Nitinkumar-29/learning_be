"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.warehouseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validator_1 = require("../common/validator");
const warehouse_types_1 = require("../modules/warehouse/infrastructure/persistence/document/types/warehouse.types");
const auth_module_1 = require("../modules/auth/auth.module");
const warehouse_module_1 = require("../modules/warehouse/warehouse.module");
const router = express_1.default.Router();
const { authMiddleware } = auth_module_1.authModule;
const { warehouseController } = warehouse_module_1.warehouseModule;
// routing endpoints
router.post("/create", authMiddleware.protect, (0, validator_1.validate)(warehouse_types_1.registerWarehouseSchema), warehouseController.registerWarehouse);
router.get("/fetchAll", authMiddleware.protect, warehouseController.fetchWarehouses);
router.post("/remove/:id", authMiddleware.protect, warehouseController.removeWarehouse);
exports.warehouseRoutes = router;
