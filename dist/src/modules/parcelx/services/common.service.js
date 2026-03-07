"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelXCommonService = void 0;
const parcelx_log_types_1 = require("../infrastructure/persistence/document/types/parcelx-log.types");
class ParcelXCommonService {
    constructor(parcelXRequestRepository, parcelXResponseRepository) {
        this.parcelXRequestRepository = parcelXRequestRepository;
        this.parcelXResponseRepository = parcelXResponseRepository;
    }
    async logRequest(requestLog) {
        const parsedRequestLog = parcelx_log_types_1.createParcelXRequestLogSchema.parse(requestLog);
        return await this.parcelXRequestRepository.create(parsedRequestLog);
    }
    async logRequestIdempotent(requestLog) {
        const parsedRequestLog = parcelx_log_types_1.createParcelXRequestLogSchema.parse(requestLog);
        if (!parsedRequestLog.idempotencyKey) {
            return await this.parcelXRequestRepository.create(parsedRequestLog);
        }
        return await this.parcelXRequestRepository.upsertByIdempotency(parsedRequestLog);
    }
    async logResponse(responseLog) {
        const parsedResponseLog = parcelx_log_types_1.createParcelXResponseLogSchema.parse(responseLog);
        return await this.parcelXResponseRepository.create(parsedResponseLog);
    }
}
exports.ParcelXCommonService = ParcelXCommonService;
