import mongoose from "mongoose";

export const connectToMongoDB = async () => {
  try {
    const mongoURI = process.env.mongoURI;
    if (!mongoURI) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
