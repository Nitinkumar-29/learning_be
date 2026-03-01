import { ParcelXRequestRepository } from "../../abstraction/parcel-x-request.repository";
import { ParcelXRequestLogModel } from "../schemas/parcel-x-request-log.schema";
import { CreateParcelXRequestLogDto } from "../types/parcelx-log.types";

export class ParcelXRequestDocumentRepository implements ParcelXRequestRepository {
  // log request
  async create(requestLog: CreateParcelXRequestLogDto): Promise<any> {
    return await ParcelXRequestLogModel.create(requestLog);
  }

  async upsertByIdempotency(requestLog: CreateParcelXRequestLogDto): Promise<any> {
    return await ParcelXRequestLogModel.findOneAndUpdate(
      {
        provider: requestLog.provider,
        operation: requestLog.operation,
        idempotencyKey: requestLog.idempotencyKey,
      },
      {
        $setOnInsert: requestLog,
      },
      {
        upsert: true,
        new: true,
      },
    );
  }
}
