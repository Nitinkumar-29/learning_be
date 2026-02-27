import { ParcelXResponseLogModel } from "../schemas/parcel-x-response-log.schema";

export class ParcelXResponseDocumentRepository {
    // log response
    async create(responseLog: any): Promise<any> {
        return await ParcelXResponseLogModel.create(responseLog);
    }
}
