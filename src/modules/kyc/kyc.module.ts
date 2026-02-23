import { KycConroller } from "./kyc.controller";
import { KycService } from "./kyc.service";
import { KycDocumentRepository } from "./infrastructure/persistence/document/repositories/kyc-document.repository";

const kycRepository = new KycDocumentRepository();
const kycService = new KycService(kycRepository);
const kycController = new KycConroller(kycService);

export const kycModule = {
  kycController,
  kycService,
};
