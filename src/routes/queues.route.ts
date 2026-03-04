import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import express from "express";
import {
  parcelXOrderQueue,
  parcelXOrderCancellationQueue,
} from "../modules/parcelx/queues/order/order.producer";
import { ParcelXWarehouseQueue } from "../modules/parcelx/queues/warehouse/warehouse.producer";
import { paymentLogQueue } from "../modules/payments/queues";

const router = express.Router();
const serverAdapter = new ExpressAdapter();

serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [
    new BullMQAdapter(parcelXOrderQueue),
    new BullMQAdapter(parcelXOrderCancellationQueue),
    new BullMQAdapter(ParcelXWarehouseQueue),
    new BullMQAdapter(paymentLogQueue)
  ],
  serverAdapter,
});

router.use("/admin/queues", serverAdapter.getRouter());

export const queuesRoutes = router;
