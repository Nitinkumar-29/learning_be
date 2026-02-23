import { KycRepository } from "./infrastructure/persistence/kyc.repository";

export class KycService {
  constructor(private kycRepository: KycRepository) {}

  async registerKycDetails(data: any) {
    return await this.kycRepository.create(data);
  }

  async updateKycDetails(id: string, data: any) {
    const existingRecord = await this.kycRepository.findOne({ _id: id });
    if (!existingRecord) {
      throw new Error("KYC record not found");
    }
    return await this.kycRepository.create({ ...existingRecord, ...data });
  }

  async registerBankKycDetails(data: any) {
    return await this.kycRepository.create(data);
  }

  async fetchRegisteredKycDetails(userId: string) {
    return await this.kycRepository.findOne({ userId });
  }

  async fetchRegisteredBankKycDetails(userId: string) {
    return await this.kycRepository.findOne({ userId });
  }

  async listRegisteredKycs(query:any) {
    
    return await this.kycRepository.findMany(query);
  }
}
