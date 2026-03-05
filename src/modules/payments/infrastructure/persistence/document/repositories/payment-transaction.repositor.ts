import { PaymentTransactionRepository } from "../../abstraction/payment-transaction.repository";
import { TransactionModel } from "../schemas/transactions.schema";
import { ClientSession } from "mongoose";

export class PaymentTransactionDocumentRepository implements PaymentTransactionRepository {
  async create(payload: Partial<any>, session?: ClientSession): Promise<any> {
    const [doc] = await TransactionModel.create([payload], { session });
    return doc;
  }
  async fetchAll(payload: any): Promise<any> {}
  async findByGatewayPaymentId(id: string, session?: ClientSession): Promise<any> {
    return await TransactionModel.findOne({ providerPaymentId: id }).session(
      session ?? null,
    );
  }
  async findById(payload: any): Promise<any> {}
  async findByPaymentOrderId(id: string): Promise<any> {
    return await TransactionModel.find({ orderId: id }).sort({ createdAt: -1 });
  }
  async findOne(payload: any): Promise<any> {}
  async updateOne(payload: any): Promise<any> {}
}
