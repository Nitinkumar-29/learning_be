import express from "express";
import { validate } from "../common/validator";
import { registerWarehouseSchema } from "../modules/warehouse/infrastructure/persistence/document/types/warehouse.types";
import { authModule } from "../modules/auth/auth.module";
import { warehouseModule } from "../modules/warehouse/warehouse.module";
const router = express.Router();
const { authMiddleware } = authModule;
const { warehouseController } = warehouseModule;
// routing endpoints
router.post(
  "/create",
  authMiddleware.protect,
  validate(registerWarehouseSchema),
  warehouseController.registerWarehouse,
);

router.get(
  "/fetchAll",
  authMiddleware.protect,
  warehouseController.fetchWarehouses,
);

export const warehouseRoutes = router;
