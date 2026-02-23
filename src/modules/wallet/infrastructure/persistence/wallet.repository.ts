// abstraction layer for the wallet repository

export abstract class WalletRepository {
  abstract create(userId: string, walletData: any): Promise<any>;
  abstract findyById(userId: string): Promise<any>;
  abstract updateOne(userId: string, walletData: any): Promise<any>;
  abstract delete(userId: string): Promise<void>;
}