import Redis from "ioredis";
import { env } from "./env";
import { HttpError } from "../common/errors/http.error";

// use local redis for development
const redisUrl = env.redis.url;
if (!redisUrl) {
  throw new HttpError(500, "Missing Redis URL in environment variables");
}

export const createRedisConnection = (): Redis => {
  const redisClient = new Redis(redisUrl, {
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
