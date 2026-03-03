import { paymentOrderStatusEnums } from "../../../../../../common/enums/payment-gateway.enum";
import { PaymentOrderRepository } from "../../abstraction/payment-order.repository";
import { PaymentOrderModel } from "../schemas/payment-order.schema";
import { IPaymentOrder, PaymentOrderDto } from "../types/payment-order.types";

export class PaymentOrderDocumentRepository implements PaymentOrderRepository {
  async create({
    paymentOrder,
    userId,
  }: {
    paymentOrder: PaymentOrderDto;
    userId: string;
  }): Promise<IPaymentOrder> {
    // amountInPaise is already in smallest unit and should be persisted as-is
    const payload = {
      ...paymentOrder,
      amountInPaise: paymentOrder.amountInPaise,
      userId,
    };
    return (await PaymentOrderModel.create(
      payload,
    )) as unknown as IPaymentOrder;
  }
  async fetchAll(payload: any): Promise<any> {}
  async findByGatewayOrderId(id: string): Promise<any> {}
  async findById(payload: any): Promise<any> {}
  async findOne(payload: any): Promise<any> {}
  async updateOne({
    refId,
    payload,
  }: {
    refId: string;
    payload: {
      providerOrderId: string | null;
      orderDetails: any;
      orderStatus: paymentOrderStatusEnums;
    };
  }): Promise<IPaymentOrder | null> {
    // find order by refid for uniquenes and then update details
    return await PaymentOrderModel.findOneAndUpdate(
      { refId },
      { ...payload },
      { new: true },
    );
  }
}
