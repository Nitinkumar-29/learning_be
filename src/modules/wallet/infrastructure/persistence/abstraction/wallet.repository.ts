// abstraction layer for the wallet repository

import { ClientSession } from "mongoose";

export abstract class WalletRepository {
  abstract create(
    userId: string,
    walletData: Record<string, unknown>,
    session?: ClientSession,
  ): Promise<any>;
  abstract findById(walletId: string, session?: ClientSession): Promise<any>;
  abstract findByUserId(userId: string, session?: ClientSession): Promise<any>;
  abstract updateOne(
    walletId: string,
    walletData: Record<string, unknown>,
    session?: ClientSession,
  ): Promise<any>;
  abstract delete(walletId: string, session?: ClientSession): Promise<void>;
}
