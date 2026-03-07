"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletModule = void 0;
const wallet_document_repository_1 = require("./infrastructure/persistence/document/repositories/wallet-document.repository");
const wallet_controller_1 = require("./wallet.controller");
const wallet_service_1 = require("./services/wallet.service");
const wallet_ledger_document_repository_1 = require("./infrastructure/persistence/document/repositories/wallet-ledger-document.repository");
const wallet_ledger_service_1 = require("./services/wallet-ledger.service");
const walletRepository = new wallet_document_repository_1.WalletDocumentRepository();
const walletLedgerRepository = new wallet_ledger_document_repository_1.WalletLedgerDocumentRepository();
const walletLedgerService = new wallet_ledger_service_1.WalletLedgerService(walletLedgerRepository);
const walletService = new wallet_service_1.WalletService(walletRepository, walletLedgerService);
const walletController = new wallet_controller_1.WalletController(walletService);
exports.walletModule = {
    walletController,
    walletService,
};
