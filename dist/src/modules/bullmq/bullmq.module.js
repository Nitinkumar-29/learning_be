"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shutdownBullWorkers = exports.initializeBullWorkers = void 0;
const order_consumer_1 = require("../parcelx/queues/order/order.consumer");
const warehouse_consumer_1 = require("../parcelx/queues/warehouse/warehouse.consumer");
const queues_1 = require("../payments/queues");
let workers = [];
const initializeBullWorkers = () => {
    if (workers.length > 0) {
        return workers;
    }
    workers = [
        (0, order_consumer_1.parcelXOrderConsumer)(),
        (0, order_consumer_1.parcelXOrderCancellationConsumer)(),
        (0, warehouse_consumer_1.parcelXWarehouseConsumer)(),
        (0, queues_1.paymentLogConsumer)(),
        (0, queues_1.paymentWebhookLogConsumer)(),
    ];
    return workers;
};
exports.initializeBullWorkers = initializeBullWorkers;
const shutdownBullWorkers = async () => {
    if (!workers.length) {
        return;
    }
    await Promise.allSettled(workers.map((worker) => worker.close()));
};
exports.shutdownBullWorkers = shutdownBullWorkers;
