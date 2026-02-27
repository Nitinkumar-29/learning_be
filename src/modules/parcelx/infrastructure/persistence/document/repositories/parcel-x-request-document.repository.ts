import { ParcelXRequestLogModel } from "../schemas/parcel-x-request-log.schema";

export class ParcelXRequestDocumentRepository {
    // log request
    async create(requestLog: any): Promise<any> {
        return await ParcelXRequestLogModel.create(requestLog);
    }
}
