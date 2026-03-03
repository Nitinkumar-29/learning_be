import { BaseRepository } from "./base.repository";

export abstract class PaymentOrderRepository extends BaseRepository {
  abstract findByGatewayOrderId(id: string): Promise<any>;
}
