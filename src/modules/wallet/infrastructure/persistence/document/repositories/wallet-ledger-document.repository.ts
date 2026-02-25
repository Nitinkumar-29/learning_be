import { ClientSession } from "mongoose";
import { WalletLedgerRepository } from "../../abstraction/wallet-ledger.repository";
import { WalletLedgerModel } from "../schemas/wallet-ledger.schema";
import { CreateWalletLedgerDto } from "../types/wallet-ledger.type";

export class WalletLedgerDocumentRepository extends WalletLedgerRepository {
  async create(
    data: CreateWalletLedgerDto,
    session?: ClientSession,
  ): Promise<any> {
    const [doc] = await WalletLedgerModel.create([data], { session });
    return doc;
  }
}
