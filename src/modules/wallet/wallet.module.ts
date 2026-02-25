import { WalletDocumentRepository } from "./infrastructure/persistence/document/repositories/wallet-document.repository";
import { WalletController } from "./wallet.controller";
import { WalletService } from "./services/wallet.service";
import { WalletLedgerDocumentRepository } from "./infrastructure/persistence/document/repositories/wallet-ledger-document.repository";
import { WalletLedgerService } from "./services/wallet-ledger.service";

const walletRepository = new WalletDocumentRepository();
const walletLedgerRepository = new WalletLedgerDocumentRepository();
const walletLedgerService = new WalletLedgerService(walletLedgerRepository);
const walletService = new WalletService(walletRepository, walletLedgerService);
const walletController = new WalletController(walletService);

export const walletModule = {
  walletController,
  walletService,
};
