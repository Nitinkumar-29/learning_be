import { createParcelXQueue } from "../queue.factory";

export const parcelXOrder = "parcelx-orders-queue";
export const parcelXOrderCancellation = "parcelx-order-cancellation-queue";

export type ParcelXOrderJobData = {
  orderId: string;
  userId: string;
  clientOrderId?: string;
};

export type ParcelXOrderCancellationJobData = {
  orderId: string;
  cancellationReason: string;
  userId: string;
  clientOrderId?: string;
  payload?: unknown;
};

export const parcelXOrderQueue = createParcelXQueue<ParcelXOrderJobData>(
  parcelXOrder,
);

export const parcelXOrderCancellationQueue =
  createParcelXQueue<ParcelXOrderCancellationJobData>(
    parcelXOrderCancellation,
  );
