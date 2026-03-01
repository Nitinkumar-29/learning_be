import { Job, UnrecoverableError, Worker } from "bullmq";
import redisClient from "../../../../config/redis.config";
import {
  parcelXOrder,
  parcelXOrderCancellation,
  ParcelXOrderCancellationJobData,
  ParcelXOrderJobData,
} from "./order.producer";
import { parcelXModule } from "../../parcel.module";
import { handleJobError } from "../../../../common/errors/handle.job.errors";

const processParcelXOrderJob = async (job: Job<ParcelXOrderJobData>) => {
  try {
    const { orderId } = job.data;
    console.log(`Processing ParcelX order job for orderId: ${orderId}`);
    const result =
      await parcelXModule.parcelXOrderService.processParcelXOrder(orderId);
    return {
      orderId,
      success: true,
      message: `ParcelX order processing completed for orderId: ${orderId}`,
      parcelX: result,
    };
  } catch (error: any) {
    console.error(
      `Error processing ParcelX order job for orderId: ${job.data.orderId}, error: ${error.message}`,
    );
    handleJobError(error);
  }
};

const parcelXOrderCancellationJob = async (
  job: Job<ParcelXOrderCancellationJobData>,
) => {
  try {
    const { orderId } = job.data;
    const result =
      await parcelXModule.parcelXOrderService.processParcelXOrderCancellation(
        orderId,
      );
    return {
      orderId,
      message: "ParcelX order cancellation completed",
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error(
      `Error processing ParcelX order cancellation job for orderId: ${job.data.orderId}, error: ${error.message}`,
    );
    handleJobError(error);
  }
};

export const parcelXOrderCancellationConsumer = () => {
  const worker = new Worker<ParcelXOrderCancellationJobData>(
    parcelXOrderCancellation,
    parcelXOrderCancellationJob,
    {
      connection: redisClient,
      concurrency: 5,
    },
  );
  worker.on("completed", (job) => {
    console.log(`ParcelX order cancellation job completed: ${job.id}`);
  });

  worker.on("failed", (job, err) => {
    console.error(
      `ParcelX order cancellation job failed: ${job?.id}, error: ${err.message}`,
    );
  });
  return worker;
};

export const parcelXOrderConsumer = () => {
  const worker = new Worker<ParcelXOrderJobData>(
    parcelXOrder,
    processParcelXOrderJob,
    {
      connection: redisClient,
      concurrency: 5,
    },
  );

  worker.on("completed", (job) => {
    console.log(`ParcelX order job completed: ${job.id}`);
  });

  worker.on("failed", (job, err) => {
    console.error(
      `ParcelX order job failed: ${job?.id}, error: ${err.message}`,
    );
  });

  return worker;
};
