"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseController = void 0;
class WarehouseController {
    constructor(warehouseService) {
        this.warehouseService = warehouseService;
        ((this.warehouseService = warehouseService),
            (this.registerWarehouse = this.registerWarehouse.bind(this)));
        this.fetchWarehouses = this.fetchWarehouses.bind(this);
        this.removeWarehouse = this.removeWarehouse.bind(this);
    }
    // register warehouse
    async registerWarehouse(req, res, next) {
        try {
            const registerWarehousePayload = req.body;
            const userId = req.user.id;
            const result = await this.warehouseService.register(userId, registerWarehousePayload);
            res.status(201).json({
                messsage: "Warehouse registration request initiated!",
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    //   fetch all warehouses based on role if admin all otherwise user creted
    async fetchWarehouses(req, res, next) {
        try {
            const userId = req.user.id;
            const page = Math.max(1, Number(req.query.page) || 1);
            const limit = Math.max(1, Number(req.query.limit) || 10);
            const queryParams = {
                page,
                limit,
            };
            const userRole = req.user.role;
            const result = await this.warehouseService.getRelativeWarehousesData(userId, userRole, queryParams);
            res.status(200).json({
                message: "Fetched warehouses data successfully!",
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // remove warehouse --> set to inactive
    async removeWarehouse(req, res, next) {
        try {
            const { id } = req.params;
            const warehouseId = Array.isArray(id) ? id[0] : id;
            const response = await this.warehouseService.removeWarehouse(warehouseId);
            res.status(200).json({
                message: `Request initiated for warehouse ${warehouseId} removal.`,
                success: true,
                data: response,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.WarehouseController = WarehouseController;
