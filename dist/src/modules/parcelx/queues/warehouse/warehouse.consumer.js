"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parcelXWarehouseConsumer = void 0;
const bullmq_1 = require("bullmq");
const warehouse_producer_1 = require("./warehouse.producer");
const redis_config_1 = require("../../../../config/redis.config");
const warehouse_job_1 = require("./warehouse.job");
const parcelXWarehouseConsumer = () => {
    const worker = new bullmq_1.Worker(warehouse_producer_1.parcelXWarehouse, warehouse_job_1.processParcelXWarehouseJob, {
        connection: (0, redis_config_1.createRedisConnection)(),
        concurrency: 5,
    });
    worker.on("completed", (job) => {
        console.log(`ParcelX warehouse job completed: ${job.id}`);
    });
    worker.on("failed", (job, err) => {
        let parsedMessage = err?.message;
        if (typeof err?.message === "string") {
            try {
                parsedMessage = JSON.parse(err.message);
            }
            catch {
                parsedMessage = err.message;
            }
        }
        console.error(JSON.stringify({
            jobId: job?.id ?? null,
            warehouseId: job?.data?.warehouseId ?? null,
            message: "ParcelX warehouse job failed",
            errorName: err?.name ?? null,
            error: parsedMessage,
            stack: err?.stack ?? null,
        }));
    });
    return worker;
};
exports.parcelXWarehouseConsumer = parcelXWarehouseConsumer;
