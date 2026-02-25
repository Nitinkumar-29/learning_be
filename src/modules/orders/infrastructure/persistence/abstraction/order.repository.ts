import { ClientSession } from "mongoose";

export abstract class OrderRepository {
  abstract create(
    orderData: Record<string, unknown>,
    session?: ClientSession,
  ): Promise<any>;

  abstract findById(orderId: string, session?: ClientSession): Promise<any>;

  abstract findByUserAndClientOrderId(
    userId: string,
    clientOrderId: string,
    session?: ClientSession,
  ): Promise<any>;

  abstract findByOrderNumber(
    orderNumber: string,
    session?: ClientSession,
  ): Promise<any>;

  abstract updateOne(
    orderId: string,
    orderData: Record<string, unknown>,
    session?: ClientSession,
  ): Promise<any>;
}
