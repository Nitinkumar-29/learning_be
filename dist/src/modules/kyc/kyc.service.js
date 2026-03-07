"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycService = void 0;
class KycService {
    constructor(kycRepository) {
        this.kycRepository = kycRepository;
    }
    async registerKycDetails(data) {
        return await this.kycRepository.create(data);
    }
    async updateKycDetails(id, data) {
        const existingRecord = await this.kycRepository.findOne({ _id: id });
        if (!existingRecord) {
            throw new Error("KYC record not found");
        }
        return await this.kycRepository.create({ ...existingRecord, ...data });
    }
    async registerBankKycDetails(data) {
        return await this.kycRepository.create(data);
    }
    async fetchRegisteredKycDetails(userId) {
        return await this.kycRepository.findOne({ userId });
    }
    async fetchRegisteredBankKycDetails(userId) {
        return await this.kycRepository.findOne({ userId });
    }
    async listRegisteredKycs(query) {
        return await this.kycRepository.findMany(query);
    }
}
exports.KycService = KycService;
