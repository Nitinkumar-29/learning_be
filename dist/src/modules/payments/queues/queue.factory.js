"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_config_1 = require("../../../config/redis.config");
const createPaymentQueue = (name) => {
    const defaultQueueOptions = {
        connection: (0, redis_config_1.createRedisConnection)(),
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
    return new bullmq_1.Queue(name, defaultQueueOptions);
};
exports.createPaymentQueue = createPaymentQueue;
