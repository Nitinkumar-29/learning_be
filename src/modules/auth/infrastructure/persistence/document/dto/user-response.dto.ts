import { Types } from "mongoose";

export interface IUserResponse {
  _id: Types.ObjectId;
  email: string;
  mobileNumber: string;
  role: string;
  monthlyOrder: number;
  businessType: string;
  isKycDone: boolean;
  isActive: boolean;
  companyName: string;
  name: string;
  updatedAt: Date;
  createdAt: Date;
}
