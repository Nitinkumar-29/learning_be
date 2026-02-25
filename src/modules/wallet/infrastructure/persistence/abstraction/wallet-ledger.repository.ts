import { ClientSession } from "mongoose";
import { CreateWalletLedgerDto } from "../document/types/wallet-ledger.type";

export abstract class WalletLedgerRepository {
  abstract create(
    data: CreateWalletLedgerDto,
    session?: ClientSession,
  ): Promise<any>;
}
