import { Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  mobileNumber: string;
  role: "admin" | "user";
}
