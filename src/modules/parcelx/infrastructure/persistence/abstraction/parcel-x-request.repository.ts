import { CreateParcelXRequestLogDto } from "../document/types/parcelx-log.types";

export abstract class ParcelXRequestRepository {
  abstract create(requestLog: CreateParcelXRequestLogDto): Promise<any>;
  abstract upsertByIdempotency(
    requestLog: CreateParcelXRequestLogDto,
  ): Promise<any>;
}
