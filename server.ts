import express, { Request, Response } from "express";
import cors from "cors";
import { authRouter } from "./src/routes/auth.route";
import { kycRouter } from "./src/routes/kyc.route";
import { storageRouter } from "./src/routes/storage.route";
import { connectToMongoDB } from "./src/config/db/mongodb.connection";
import { errorHandler } from "./src/common/middleware/error.middleware";
import { requestLogger } from "./src/common/middleware/requestLogger";
import { env } from "./src/config/env";

const app = express();

const startServer = async () => {
  await connectToMongoDB();
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

  app.use("/auth", authRouter);
  app.use("/kyc", kycRouter);
  app.use("/storage", storageRouter);

  // error handling middleware should be the last middleware
  app.use(errorHandler);

  const PORT = env.app.port;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
