import { PaymentLogsRepository } from "../../abstraction/payment-logs.repository";
import { PaymentLogsModel } from "../schemas/logs.schema";

export class PaymentLogsDocumentRepository implements PaymentLogsRepository {
  async create(payload: any): Promise<any> {
    return await PaymentLogsModel.create(payload);
  }
  async upsertByRefAndOperation({
    refId,
    operation,
    payload,
  }: {
    refId: string;
    operation: string;
    payload: any;
  }): Promise<any> {
    const { refId: _payloadRefId, operation: _payloadOperation, ...safePayload } =
      payload ?? {};

    return await PaymentLogsModel.findOneAndUpdate(
      { refId, operation },
      {
        $set: safePayload,
        $setOnInsert: { refId, operation },
      },
      { returnDocument: "after", upsert: true },
    );
  }
  async fetchAll(query: any): Promise<any> {}
  async findById(id: any): Promise<any> {
    return await PaymentLogsModel.findById(id);
  }
  async findMany(query: any): Promise<any> {}
  async findOne(_id: string): Promise<any> {
    return await PaymentLogsModel.findOne({ _id });
  }
  async findOneAndUpdateOne(id: string, payload: any): Promise<any> {}
}
