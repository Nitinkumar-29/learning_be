import { HttpError } from "../../../common/errors/http.error";
import { WalletLedgerModel } from "../infrastructure/persistence/document/schemas/wallet-ledger.schema";
import {
  CreateWalletLedgerDto,
  createWalletLedgerSchema,
} from "../infrastructure/persistence/document/types/wallet-ledger.type";

export class WalletLedgerService {
  constructor() {}

  // create a transaction record for a wallet operation (credit/debit/hold/release/refund)
  async createTransactionRecord(
    transactionData: CreateWalletLedgerDto,
  ): Promise<any> {
    const payload = createWalletLedgerSchema.parse(transactionData);

    try {
      return await WalletLedgerModel.create(payload);
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
