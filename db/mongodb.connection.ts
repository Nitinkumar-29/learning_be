import mongoose from "mongoose";

export const connectToMongoDB = async () => {
  try {
    const mongoURI = "mongodb://localhost:27017/backend_oops";
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
