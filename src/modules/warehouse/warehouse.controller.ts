import { NextFunction, Request, Response } from "express";
import { WarehouseService } from "./warehouse.service";
import { RegisterWarehouseDto } from "./infrastructure/persistence/document/types/warehouse.types";

export class WarehouseController {
  constructor(private warehouseService: WarehouseService) {
    this.warehouseService = warehouseService,
    this.registerWarehouse = this.registerWarehouse.bind(this);
    this.fetchWarehouses = this.fetchWarehouses.bind(this);
  }

  // register warehouse
  async registerWarehouse(req: Request, res: Response, next: NextFunction) {
    try {
      const registerWarehousePayload = req.body as RegisterWarehouseDto;
      const userId = req.user!.id as unknown as string;
      const result = await this.warehouseService.register(
        userId,
        registerWarehousePayload,
      );
      res.status(201).json({
        messsage: "Warehouse registration request initiated!",
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  //   fetch all warehouses based on role if admin all otherwise user creted
  async fetchWarehouses(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const userId = req.user!.id;
      const queryParams = req.query
      const userRole = req.user!.role;
      const result = await this.warehouseService.getRelativeWarehousesData(
        userId,
        userRole,
        queryParams
      );
      res.status(200).json({
        message: "Fetched warehouses data successfully!",
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
