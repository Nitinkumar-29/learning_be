"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelXResponseDocumentRepository = void 0;
const parcel_x_response_log_schema_1 = require("../schemas/parcel-x-response-log.schema");
class ParcelXResponseDocumentRepository {
    // log response
    async create(responseLog) {
        return await parcel_x_response_log_schema_1.ParcelXResponseLogModel.create(responseLog);
    }
}
exports.ParcelXResponseDocumentRepository = ParcelXResponseDocumentRepository;
