import { Worker } from "bullmq";
import {
  parcelXOrderConsumer,
  parcelXOrderCancellationConsumer,
} from "../parcelx/queues/order/order.consumer";

let workers: Worker[] = [];

export const initializeBullWorkers = (): Worker[] => {
  if (workers.length > 0) {
    return workers;
  }

  workers = [parcelXOrderConsumer(), parcelXOrderCancellationConsumer()];
  return workers;
};

export const shutdownBullWorkers = async (): Promise<void> => {
  if (!workers.length) {
    return;
  }

  await Promise.allSettled(workers.map((worker) => worker.close()));
};
