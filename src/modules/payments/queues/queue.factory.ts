import { Queue, QueueOptions } from "bullmq";
import { createRedisConnection } from "../../../config/redis.config";

export const createPaymentQueue = <T>(name: string): Queue<T> => {
  const defaultQueueOptions: QueueOptions = {
    connection: createRedisConnection(),
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 3000,
      },
      removeOnComplete: 1000,
      removeOnFail: 1000,
    },
  };

  return new Queue<T>(name, defaultQueueOptions);
};
