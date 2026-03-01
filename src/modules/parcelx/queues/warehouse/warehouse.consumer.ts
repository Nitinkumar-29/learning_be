import { Job, Worker } from "bullmq";
import {
  parcelXWarehouse,
  ParcelXWarehouseJobData,
} from "./warehouse.producer";
import { parcelXModule } from "../../parcel.module";
import redisClient from "../../../../config/redis.config";
import { handleJobError } from "../../../../common/errors/handle.job.errors";

// process job
const processParcelXWarehouseJob = async (
  job: Job<ParcelXWarehouseJobData>,
) => {
  try {
    const { warehouseId } = job.data;
    console.log(`Processing parcelx warehouse creation job ${warehouseId}`);
    const result =
      await parcelXModule.parcelXWarehouseService.registerParcelXWarehouse(
        job.data,
      );
    return {
      warehouseId,
      success: true,
      message: `ParcelX warehouse processing completed for warehouseId: ${warehouseId}`,
      parcelX: result,
    };
  } catch (error: any) {
    let parsedMessage: unknown = error?.message;
    if (typeof error?.message === "string") {
      try {
        parsedMessage = JSON.parse(error.message);
      } catch {
        parsedMessage = error.message;
      }
    }

    console.error(
      JSON.stringify({
        warehouseId: job.data.warehouseId,
        message: "Error processing ParcelX warehouse job",
        errorName: error?.name ?? null,
        statusCode: error?.statusCode ?? null,
        error: parsedMessage,
        stack: error?.stack ?? null,
      }),
    );
    handleJobError(error);
  }
};

export const parcelXWarehouseConsumer = () => {
  const worker = new Worker<ParcelXWarehouseJobData>(
    parcelXWarehouse,
    processParcelXWarehouseJob,
    {
      connection: redisClient,
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
