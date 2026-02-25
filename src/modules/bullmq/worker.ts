import { connectToMongoDB } from "../../config/db/mongodb.connection";
import { initializeBullWorkers, shutdownBullWorkers } from "./bullmq.module";

const startWorker = async () => {
  await connectToMongoDB();
  initializeBullWorkers();
  console.log("Worker process started, listening for jobs...");
};

const stopWorkers = async () => {
  console.log("Shutting down workers...");
  await shutdownBullWorkers();
  process.exit(0);
};

startWorker().catch((error) => {
  console.error("Failed to start worker:", error);
  process.exit(1);
});

process.on("SIGINT", stopWorkers);
process.on("SIGTERM", stopWorkers);
