import { ParcelXResponseRepository } from "../../abstraction/parcel-x-response.repository";
import { ParcelXResponseLogModel } from "../schemas/parcel-x-response-log.schema";
import { CreateParcelXResponseLogDto } from "../types/parcelx-log.types";

export class ParcelXResponseDocumentRepository implements ParcelXResponseRepository {
  // log response
  async create(responseLog: CreateParcelXResponseLogDto): Promise<any> {
    return await ParcelXResponseLogModel.create(responseLog);
  }
}
