import { BaseRepository } from "./base.repository";

export abstract class PaymentTransactionRepository extends BaseRepository {
  abstract findByGatewayPaymentId(id: string): Promise<any>;
  abstract findByPaymentOrderId(id: string): Promise<any>;
}
