import { Queue, QueueOptions } from "bullmq";
import redisClient from "../../../config/redis.config";

const defaultQueueOptions: QueueOptions = {
  connection: redisClient,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: 1000,
    removeOnFail: 1000,
  },
};

export const createParcelXQueue = <T>(name: string): Queue<T> => {
  return new Queue<T>(name, defaultQueueOptions);
};
