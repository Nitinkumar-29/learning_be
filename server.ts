import express, { Request, Response } from "express";
import cors from "cors";
import { authRouter } from "./src/routes/auth.route";
import { connectToMongoDB } from "./db/mongodb.connection";
import { errorHandler } from "./src/common/middleware/error.middleware";
require("dotenv").config();

const app = express();

const startServer = async () => {
  await connectToMongoDB();
  app.use(express.json());
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
  });

  app.use("/auth", authRouter);

  // error handling middleware should be the last middleware
  app.use(errorHandler);

  const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
