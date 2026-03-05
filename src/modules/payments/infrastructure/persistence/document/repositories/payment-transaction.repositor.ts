import { PaymentTransactionRepository } from "../../abstraction/payment-transaction.repository";
import { TransactionModel } from "../schemas/transactions.schema";

export class PaymentTransactionDocumentRepository implements PaymentTransactionRepository {
  async create(payload: Partial<any>): Promise<any> {
    return await TransactionModel.create(payload);
  }
  async fetchAll(payload: any): Promise<any> {}
  async findByGatewayPaymentId(id: string): Promise<any> {
    return await TransactionModel.findOne({ providerPaymentId: id });
  }
  async findById(payload: any): Promise<any> {}
  async findByPaymentOrderId(id: string): Promise<any> {
    return await TransactionModel.find({ orderId: id }).sort({ createdAt: -1 });
  }
  async findOne(payload: any): Promise<any> {}
  async updateOne(payload: any): Promise<any> {}
}
