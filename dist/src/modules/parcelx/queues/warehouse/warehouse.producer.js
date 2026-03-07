"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelXWarehouseQueue = exports.parcelXWarehouse = void 0;
const queue_factory_1 = require("../queue.factory");
// export tpye job payload
exports.parcelXWarehouse = "parcelx-warehouse-queue";
exports.ParcelXWarehouseQueue = (0, queue_factory_1.createParcelXQueue)(exports.parcelXWarehouse);
