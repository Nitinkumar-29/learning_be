import { Job, UnrecoverableError, Worker } from "bullmq";
import redisClient from "../../../../config/redis.config";
import { parcelXOrder, ParcelXOrderJobData } from "./order.producer";
import { parcelXModule } from "../../parcel.module";
import { NonRetryableJobError } from "../../errors/job.errors";

const processParcelXOrderJob = async (job: Job<ParcelXOrderJobData>) => {
  try {
    const { orderId } = job.data;
    console.log(`Processing ParcelX order job for orderId: ${orderId}`);
    await parcelXModule.parcelXOrderService.processParcelXOrder(orderId);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(
      `Completed processing ParcelX order job for orderId: ${orderId}`,
    );
  } catch (error: any) {
    // stop retries for non-retryable errors
    if (error instanceof NonRetryableJobError) {
      throw new UnrecoverableError(
        (error instanceof Error && error.message) ||
          "Non-retryable error occurred while processing ParcelX order job",
      );
    }
    //  log the error and let the job be retried according to the queue's retry strategy
    console.error(
      `Error processing ParcelX order job for orderId: ${job.data.orderId}, error: ${error.message}`,
    );
    throw error;
  }
};

export const createParcelXOrderConsumer = () => {
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
