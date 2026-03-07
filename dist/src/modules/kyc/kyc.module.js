"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kycModule = void 0;
const kyc_controller_1 = require("./kyc.controller");
const kyc_service_1 = require("./kyc.service");
const kyc_document_repository_1 = require("./infrastructure/persistence/document/repositories/kyc-document.repository");
const kycRepository = new kyc_document_repository_1.KycDocumentRepository();
const kycService = new kyc_service_1.KycService(kycRepository);
const kycController = new kyc_controller_1.KycConroller(kycService);
exports.kycModule = {
    kycController,
    kycService,
};
