import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import express from "express";
import {
  parcelXOrderQueue,
  parcelXOrderCancellationQueue,
} from "../modules/parcelx/queues/order/order.producer";

const router = express.Router();
const serverAdapter = new ExpressAdapter();

serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [
    new BullMQAdapter(parcelXOrderQueue),
    new BullMQAdapter(parcelXOrderCancellationQueue),
  ],
  serverAdapter,
});

router.use("/admin/queues", serverAdapter.getRouter());

export const queuesRouter = router;
