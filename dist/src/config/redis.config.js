"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRedisConnection = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("./env");
const http_error_1 = require("../common/errors/http.error");
// use local redis for development
const redisUrl = env_1.env.redis.url;
if (!redisUrl) {
    throw new http_error_1.HttpError(500, "Missing Redis URL in environment variables");
}
const createRedisConnection = () => {
    const redisClient = new ioredis_1.default(redisUrl, {
        tls: redisUrl.startsWith("rediss://") ? {} : undefined,
        connectTimeout: 5000,
        lazyConnect: true,
        enableReadyCheck: true,
        enableOfflineQueue: true,
        maxRetriesPerRequest: null,
        retryStrategy: (times) => Math.min(times * 200, 2000),
    });
    redisClient.on("connect", () => {
        console.log("Connected to Redis Successfully!");
    });
    redisClient.on("error", (err) => {
        console.error("Redis error:", err);
    });
    redisClient.on("end", () => {
        console.warn("Redis connection closed");
    });
    return redisClient;
};
exports.createRedisConnection = createRedisConnection;
