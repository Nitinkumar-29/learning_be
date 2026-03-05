import { ClientSession } from "mongoose";

export abstract class PaymentTransactionRepository {
  abstract create(payload: Partial<any>, session?: ClientSession): Promise<any>;
  abstract fetchAll(payload: any): Promise<any>;
  abstract findById(payload: any): Promise<any>;
  abstract findOne(payload: any): Promise<any>;
  abstract updateOne(payload: any): Promise<any>;
  abstract findByGatewayPaymentId(id: string, session?: ClientSession): Promise<any>;
  abstract findByPaymentOrderId(id: string): Promise<any>;
}
