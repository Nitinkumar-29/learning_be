import { PaymentLogsRepository } from "../infrastructure/persistence/abstraction/payment-logs.repository";
import {
  createOrderRequestLogSchema,
  createOrderResponseLogSchema,
  createTransactionRequestLogSchema,
  createTransactionResponseLogSchema,
} from "../infrastructure/persistence/document/types/payment.logs.types";

export class PaymentLogService {
  constructor(private readonly paymentLogsRepository: PaymentLogsRepository) {}

  // create order log request
  async logCreateOrderRequest(data: unknown) {
    const parsed = createOrderRequestLogSchema.parse(data);
    console.log(parsed,"parsed---data-log-request")
    return await this.paymentLogsRepository.upsertByRefAndOperation({
      refId: parsed.refId,
      operation: parsed.operation,
      payload: parsed,
    });
  }

  // create order log response
  async logCreateOrderResponse(data: unknown) {
    const parsed = createOrderResponseLogSchema.parse(data);
    return await this.paymentLogsRepository.upsertByRefAndOperation({
      refId: parsed.refId,
      operation: parsed.operation,
      payload: parsed,
    });
  }

  // create txn log request
  async logCreateTxnRequest(data: unknown) {
    const parsed = createTransactionRequestLogSchema.parse(data);
    return await this.paymentLogsRepository.upsertByRefAndOperation({
      refId: parsed.refId,
      operation: parsed.operation,
      payload: parsed,
    });
  }

  // async txn log response
  async logCreateTxnResponse(data: unknown) {
    const parsed = createTransactionResponseLogSchema.parse(data);
    return await this.paymentLogsRepository.upsertByRefAndOperation({
      refId: parsed.refId,
      operation: parsed.operation,
      payload: parsed,
    });
  }
}
