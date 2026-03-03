import { PaymentTransactionRepository } from "../../abstraction/payment-transaction.repository";

export class PaymentTransactionDocumentRepository implements PaymentTransactionRepository {
  async create(payload: Partial<any>): Promise<any> {}
  async fetchAll(payload: any): Promise<any> {}
  async findByGatewayPaymentId(id: string): Promise<any> {}
  async findById(payload: any): Promise<any> {}
  async findByPaymentOrderId(id: string): Promise<any> {}
  async findOne(payload: any): Promise<any> {}
  async updateOne(payload: any): Promise<any> {}
}
