"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelXRequestDocumentRepository = void 0;
const parcel_x_request_log_schema_1 = require("../schemas/parcel-x-request-log.schema");
class ParcelXRequestDocumentRepository {
    // log request
    async create(requestLog) {
        return await parcel_x_request_log_schema_1.ParcelXRequestLogModel.create(requestLog);
    }
    async upsertByIdempotency(requestLog) {
        return await parcel_x_request_log_schema_1.ParcelXRequestLogModel.findOneAndUpdate({
            provider: requestLog.provider,
            operation: requestLog.operation,
            idempotencyKey: requestLog.idempotencyKey,
        }, {
            $setOnInsert: requestLog,
        }, {
            upsert: true,
            new: true,
        });
    }
}
exports.ParcelXRequestDocumentRepository = ParcelXRequestDocumentRepository;
