import { BaseRepository } from "./base.repository";
import { ClientSession } from "mongoose";

export abstract class PaymentOrderRepository extends BaseRepository {
  abstract findByGatewayOrderId(id: string, session?: ClientSession): Promise<any>;
}
