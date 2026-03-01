import { Worker } from "bullmq";
import {
  parcelXOrderConsumer,
  parcelXOrderCancellationConsumer,
} from "../parcelx/queues/order/order.consumer";
import { parcelXWarehouseConsumer } from "../parcelx/queues/warehouse/warehouse.consumer";

let workers: Worker[] = [];

export const initializeBullWorkers = (): Worker[] => {
  if (workers.length > 0) {
    return workers;
  }

  workers = [
    parcelXOrderConsumer(),
    parcelXOrderCancellationConsumer(),
    parcelXWarehouseConsumer(),
  ];
  return workers;
};

export const shutdownBullWorkers = async (): Promise<void> => {
  if (!workers.length) {
    return;
  }

  await Promise.allSettled(workers.map((worker) => worker.close()));
};
