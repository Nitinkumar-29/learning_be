import { ParcelXRequestRepository } from "../infrastructure/persistence/abstraction/parcel-x-request.repository";
import { ParcelXResponseRepository } from "../infrastructure/persistence/abstraction/parcel-x-response.repository";
import {
  createParcelXRequestLogSchema,
  createParcelXResponseLogSchema,
  CreateParcelXRequestLogInput,
  CreateParcelXResponseLogInput,
} from "../infrastructure/persistence/document/types/parcelx-log.types";
export class ParcelXCommonService {
  constructor(
    private parcelXRequestRepository: ParcelXRequestRepository,
    private parcelXResponseRepository: ParcelXResponseRepository,
  ) {}

  async logRequest(requestLog: CreateParcelXRequestLogInput): Promise<any> {
    const parsedRequestLog = createParcelXRequestLogSchema.parse(requestLog);
    return await this.parcelXRequestRepository.create(parsedRequestLog);
  }

  async logRequestIdempotent(
    requestLog: CreateParcelXRequestLogInput,
  ): Promise<any> {
    const parsedRequestLog = createParcelXRequestLogSchema.parse(requestLog);
    if (!parsedRequestLog.idempotencyKey) {
      return await this.parcelXRequestRepository.create(parsedRequestLog);
    }

    return await this.parcelXRequestRepository.upsertByIdempotency(
      parsedRequestLog,
    );
  }

  async logResponse(responseLog: CreateParcelXResponseLogInput): Promise<any> {
    const parsedResponseLog = createParcelXResponseLogSchema.parse(responseLog);
    return await this.parcelXResponseRepository.create(parsedResponseLog);
  }
}
