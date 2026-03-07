"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parcelXOrderConsumer = exports.parcelXOrderCancellationConsumer = void 0;
const bullmq_1 = require("bullmq");
const redis_config_1 = require("../../../../config/redis.config");
const order_producer_1 = require("./order.producer");
const parcel_module_1 = require("../../parcel.module");
const handle_job_errors_1 = require("../../../../common/errors/handle.job.errors");
const processParcelXOrderJob = async (job) => {
    try {
        const { orderId } = job.data;
        console.log(`Processing ParcelX order job for orderId: ${orderId}`);
        const result = await parcel_module_1.parcelXModule.parcelXOrderService.processParcelXOrder(orderId);
        return {
            orderId,
            success: true,
            message: `ParcelX order processing completed for orderId: ${orderId}`,
            parcelX: result,
        };
    }
    catch (error) {
        console.error(`Error processing ParcelX order job for orderId: ${job.data.orderId}, error: ${error.message}`);
        (0, handle_job_errors_1.handleJobError)(error);
    }
};
const parcelXOrderCancellationJob = async (job) => {
    try {
        const { orderId } = job.data;
        const result = await parcel_module_1.parcelXModule.parcelXOrderService.processParcelXOrderCancellation(orderId);
        return {
            orderId,
            message: "ParcelX order cancellation completed",
            success: true,
            data: result,
        };
    }
    catch (error) {
        console.error(`Error processing ParcelX order cancellation job for orderId: ${job.data.orderId}, error: ${error.message}`);
        (0, handle_job_errors_1.handleJobError)(error);
    }
};
const parcelXOrderCancellationConsumer = () => {
    const worker = new bullmq_1.Worker(order_producer_1.parcelXOrderCancellation, parcelXOrderCancellationJob, {
        connection: (0, redis_config_1.createRedisConnection)(),
        concurrency: 5,
    });
    worker.on("completed", (job) => {
        console.log(`ParcelX order cancellation job completed: ${job.id}`);
    });
    worker.on("failed", (job, err) => {
        console.error(`ParcelX order cancellation job failed: ${job?.id}, error: ${err.message}`);
    });
    return worker;
};
exports.parcelXOrderCancellationConsumer = parcelXOrderCancellationConsumer;
const parcelXOrderConsumer = () => {
    const worker = new bullmq_1.Worker(order_producer_1.parcelXOrder, processParcelXOrderJob, {
        connection: (0, redis_config_1.createRedisConnection)(),
        concurrency: 5,
    });
    worker.on("completed", (job) => {
        console.log(`ParcelX order job completed: ${job.id}`);
    });
    worker.on("failed", (job, err) => {
        console.error(`ParcelX order job failed: ${job?.id}, error: ${err.message}`);
    });
    return worker;
};
exports.parcelXOrderConsumer = parcelXOrderConsumer;
