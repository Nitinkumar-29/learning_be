"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_connection_1 = require("../../config/db/mongodb.connection");
const bullmq_module_1 = require("./bullmq.module");
const startWorker = async () => {
    await (0, mongodb_connection_1.connectToMongoDB)();
    (0, bullmq_module_1.initializeBullWorkers)();
    console.log("Worker process started, listening for jobs...");
};
const stopWorkers = async () => {
    console.log("Shutting down workers...");
    await (0, bullmq_module_1.shutdownBullWorkers)();
    process.exit(0);
};
startWorker().catch((error) => {
    console.error("Failed to start worker:", error);
    process.exit(1);
});
process.on("SIGINT", stopWorkers);
process.on("SIGTERM", stopWorkers);
