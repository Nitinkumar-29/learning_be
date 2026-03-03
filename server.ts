import express, { Request, Response } from "express";
import cors from "cors";
import { authRoutes } from "./src/routes/auth.route";
import { kycRoutes } from "./src/routes/kyc.route";
import { storageRoutes } from "./src/routes/storage.route";
import { connectToMongoDB } from "./src/config/db/mongodb.connection";
import { errorHandler } from "./src/common/middleware/error.middleware";
import { requestLogger } from "./src/common/middleware/requestLogger";
import { env } from "./src/config/env";
import { walletRoutes } from "./src/routes/wallet.route";
import { orderRoutes } from "./src/routes/order.route";
import redisClient from "./src/config/redis.config";
import { queuesRoutes } from "./src/routes/queues.route";
import { warehouseRoutes } from "./src/routes/warehouse.route";
import { paymentRoutes } from "./src/routes/payments.route";

const app = express();

const startServer = async () => {
  await connectToMongoDB();
  await redisClient.ping();

  app.use(express.json());
  app.use(requestLogger);
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
  app.use(express.urlencoded({ extended: true }));
  app.use("/uploads", express.static(env.storage.uploadDir));

  app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
  });

  app.use("/auth", authRoutes);
  app.use("/kyc", kycRoutes);
  app.use("/storage", storageRoutes);
  app.use("/wallet", walletRoutes);
  app.use("/orders", orderRoutes);
  app.use("/warehouse", warehouseRoutes);
  app.use("/payments", paymentRoutes);
  app.use("/", queuesRoutes);

  // error handling middleware should be the last middleware
  app.use(errorHandler);

  const PORT = env.app.port;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
