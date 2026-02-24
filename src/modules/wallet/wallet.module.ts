import { WalletDocumentRepository } from "./infrastructure/persistence/document/repositories/wallet-document.repository";
import { WalletController } from "./wallet.controller";
import { WalletService } from "./services/wallet.service";

const walletRepository = new WalletDocumentRepository();
const walletService = new WalletService(walletRepository);
const walletController = new WalletController(walletService);

export const walletModule = {
  walletController,
  walletService,
};
