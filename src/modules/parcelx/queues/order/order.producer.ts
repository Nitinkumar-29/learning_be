import { Queue } from "bullmq";
import redisClient from "../../../../config/redis.config";

export const parcelXOrder = "parcelx-orders-queue";

export type ParcelXOrderJobData = {
  orderId: string;
  userId: string;
  clientOrderId?: string;
};

export const parcelXOrderQueue = new Queue<ParcelXOrderJobData>(
  parcelXOrder,
  {
    connection: redisClient,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000, // 5 seconds initial delay
      },
      removeOnComplete: 1000, // keep last 1000 completed jobs
      removeOnFail: 1000, // keep last 1000 failed jobs
    },
  },
);
