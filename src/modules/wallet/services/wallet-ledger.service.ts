import { HttpError } from "../../../common/errors/http.error";
import { ClientSession } from "mongoose";
import { WalletLedgerRepository } from "../infrastructure/persistence/abstraction/wallet-ledger.repository";
import {
  CreateWalletLedgerDto,
  createWalletLedgerSchema,
} from "../infrastructure/persistence/document/types/wallet-ledger.type";

export class WalletLedgerService {
  constructor(private walletLedgerRepository: WalletLedgerRepository) {}

  // create a transaction record for a wallet operation (credit/debit/hold/release/refund)
  async createTransactionRecord(
    data: CreateWalletLedgerDto,
    session?: ClientSession,
  ): Promise<any> {
    const payload = createWalletLedgerSchema.parse(data);

    try {
      return await this.walletLedgerRepository.create(payload, session);
    } catch (error: any) {
      if (error?.code === 11000) {
        throw new HttpError(
          409,
          "Duplicate transaction for this idempotency key",
        );
      }
      throw new HttpError(500, "Failed to create wallet ledger transaction");
    }
  }
}
