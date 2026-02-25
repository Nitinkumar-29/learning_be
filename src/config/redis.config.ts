import Redis from "ioredis";
import { env } from "./env";
import { HttpError } from "../common/errors/http.error";

// use local redis for development
const redisUrl = env.redis.url;
if (!redisUrl) {
  throw new HttpError(500, "Missing Redis URL in environment variables");
}

// create redis client instance
const redisClient = new Redis(redisUrl, {
  tls: redisUrl.startsWith("rediss://") ? {} : undefined, // enable TLS if using rediss://
  connectTimeout: 5000, // 5 seconds connection timeout
  lazyConnect: true, // delay connection until first command
  enableReadyCheck: true, // check if Redis is ready before allowing commands
  enableOfflineQueue: true, // queue commands while Redis is offline
  maxRetriesPerRequest: null, // retry failed commands up to 3 times
  reconnectOnError: (err) => {
    console.error("Redis connection error:", err);
    return false; // no reconnect on any error
  },
});

// handle connection events
redisClient.on("connect", () => {
  console.log("Connected to Redis Successfully!");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

redisClient.on("end", () => {
  console.warn("Redis connection closed");
});

export default redisClient;