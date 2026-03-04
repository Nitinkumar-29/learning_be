export abstract class PaymentLogsRepository {
  abstract create(payload: any): Promise<any>;
  abstract upsertByRefAndOperation({
    refId,
    operation,
    payload,
  }: {
    refId: string;
    operation: string;
    payload: any;
  }): Promise<any>;
  abstract findById(id: any): Promise<any>;
  abstract findOne(_id: string): Promise<any>;
  abstract findOneAndUpdateOne(id: string, payload: any): Promise<any>;
  abstract findMany(query: any): Promise<any>;
  abstract fetchAll(query: any): Promise<any>;
}
