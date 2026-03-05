import {
  IPaymentOrder,
  PaymentOrderDto,
} from "../document/types/payment-order.types";
import { ClientSession } from "mongoose";

export abstract class BaseRepository {
  abstract create({
    paymentOrder,
    userId,
  }: {
    paymentOrder: PaymentOrderDto;
    userId: string;
  }): Promise<IPaymentOrder>;
  abstract findById(payload: any): Promise<any>;
  abstract fetchAll(payload: any): Promise<any>;
  abstract findOne(payload: any): Promise<any>;
  abstract updateOne({
    refId,
    payload,
    session,
  }: {
    refId: string;
    payload: any;
    session?: ClientSession;
  }): Promise<IPaymentOrder | null>;
}
