// abstraction layer for the wallet repository

export abstract class WalletRepository {
  abstract create(userId: string, walletData: any): Promise<any>;
  abstract findById(userId: string): Promise<any>;
  abstract findByUserId(userId: string): Promise<any>;
  abstract updateOne(userId: string, walletData: any): Promise<any>;
  abstract delete(userId: string): Promise<void>;
}