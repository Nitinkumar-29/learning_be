"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseDocumentRepository = void 0;
const warehouse_schema_1 = require("../schemas/warehouse.schema");
class WarehouseDocumentRepository {
    async create(userId, warehousePayload) {
        return await warehouse_schema_1.warehouseModel.create({ userId, ...warehousePayload });
    }
    async updateOne(warehouseId, payload) {
        return await warehouse_schema_1.warehouseModel.findByIdAndUpdate(warehouseId, payload, {
            new: true,
        });
    }
    async findOne(id) {
        return await warehouse_schema_1.warehouseModel.findOne({ _id: id });
    }
    async findById(warehouseId) {
        return await warehouse_schema_1.warehouseModel.findById(warehouseId);
    }
    async findMany({ basicQuery, filters, }) {
        const page = Math.max(1, Number(filters?.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(filters?.limit) || 10));
        const skip = (page - 1) * limit;
        const query = basicQuery.admin ? {} : { userId: basicQuery.userId };
        return await warehouse_schema_1.warehouseModel
            .find(query)
            .sort({ createdAt: -1, _id: -1 })
            .skip(skip)
            .limit(limit);
    }
    async totalDocuments(basicQuery) {
        const query = basicQuery.admin ? {} : { userId: basicQuery.userId };
        return await warehouse_schema_1.warehouseModel.countDocuments(query);
    }
}
exports.WarehouseDocumentRepository = WarehouseDocumentRepository;
