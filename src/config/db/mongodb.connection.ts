import mongoose from "mongoose";
import { env } from "../env";

export const connectToMongoDB = async () => {
  try {
    await mongoose.connect(env.db.mongoUri);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
