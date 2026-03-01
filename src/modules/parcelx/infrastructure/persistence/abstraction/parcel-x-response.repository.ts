import { CreateParcelXResponseLogDto } from "../document/types/parcelx-log.types";

export abstract class ParcelXResponseRepository {
  abstract create(responseLog: CreateParcelXResponseLogDto): Promise<any>;
}
