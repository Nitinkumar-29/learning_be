export abstract class PaymentTransactionRepository {
  abstract create(payload: Partial<any>): Promise<any>;
  abstract fetchAll(payload: any): Promise<any>;
  abstract findById(payload: any): Promise<any>;
  abstract findOne(payload: any): Promise<any>;
  abstract updateOne(payload: any): Promise<any>;
  abstract findByGatewayPaymentId(id: string): Promise<any>;
  abstract findByPaymentOrderId(id: string): Promise<any>;
}
