import { timeStamp } from "console";
import { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    maxlength: 10,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

export const User = model("User", userSchema);
