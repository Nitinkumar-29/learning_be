import { Worker } from "bullmq";
import { parcelXWarehouse } from "./warehouse.producer";
import { createRedisConnection } from "../../../../config/redis.config";
import {
  ParcelXWarehouseJobData,
  processParcelXWarehouseJob,
} from "./warehouse.job";

export const parcelXWarehouseConsumer = () => {
  const worker = new Worker<ParcelXWarehouseJobData>(
    parcelXWarehouse,
    processParcelXWarehouseJob,
    {
      connection: createRedisConnection(),
      concurrency: 5,
    },
  );

  worker.on("completed", (job) => {
    console.log(`ParcelX warehouse job completed: ${job.id}`);
  });

  worker.on("failed", (job, err) => {
    let parsedMessage: unknown = err?.message;
    if (typeof err?.message === "string") {
      try {
        parsedMessage = JSON.parse(err.message);
      } catch {
        parsedMessage = err.message;
      }
    }

    console.error(
      JSON.stringify({
        jobId: job?.id ?? null,
        warehouseId: job?.data?.warehouseId ?? null,
        message: "ParcelX warehouse job failed",
        errorName: err?.name ?? null,
        error: parsedMessage,
        stack: err?.stack ?? null,
      }),
    );
  });

  return worker;
};
