import { ClientSession } from "mongoose";
import { OrderRepository } from "../../abstraction/order.repository";
import { OrderModel } from "../schemas/order.schema";

export class OrderDocumentRepository extends OrderRepository {
  async create(
    orderData: Record<string, unknown>,
    session?: ClientSession,
  ): Promise<any> {
    const [order] = await OrderModel.create([orderData], { session });
    return order;
  }

  async findById(orderId: string, session?: ClientSession): Promise<any> {
    return await OrderModel.findById(orderId).session(session ?? null);
  }

  async findByUserAndClientOrderId(
    userId: string,
    clientOrderId: string,
    session?: ClientSession,
  ): Promise<any> {
    return await OrderModel.findOne({ userId, clientOrderId }).session(
      session ?? null,
    );
  }

  async findByOrderNumber(
    orderNumber: string,
    session?: ClientSession,
  ): Promise<any> {
    return await OrderModel.findOne({ orderNumber }).session(session ?? null);
  }

  async updateOne(
    orderId: string,
    orderData: Record<string, unknown>,
    session?: ClientSession,
  ): Promise<any> {
    return await OrderModel.findByIdAndUpdate(orderId, orderData, {
      new: true,
      session,
    });
  }
}
