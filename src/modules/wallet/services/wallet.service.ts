import { HttpError } from "../../../common/errors/http.error";
import { CreateWalletDto } from "../infrastructure/persistence/document/types/wallet.type";
import { WalletRepository } from "../infrastructure/persistence/wallet.repository";
import { WalletLedgerService } from "./wallet-ledger.service";

export class WalletService {
  constructor(
    private walletRepository: WalletRepository,
    private walletLedgerService: WalletLedgerService = new WalletLedgerService(),
  ) {}

  // create a new wallet for a user
  async createWallet(userId: string, walletData: any): Promise<any> {
    const user = await this.walletRepository.findByUserId(userId);
    if (user) {
      throw new HttpError(400, "User already has a wallet");
    }
    return this.walletRepository.create(userId, walletData);
  }

  // get wallet details for a user
  async getWallet(userId: string): Promise<any> {
    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new HttpError(404, "Wallet not found");
    }
    return wallet;
  }

  // update wallet details for a user
  async updateWallet({
    userId,
    walletId,
    walletData,
  }: {
    userId: string;
    walletId: string;
    walletData: CreateWalletDto;
  }): Promise<any> {
    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new HttpError(404, "Wallet not found");
    }

    return await this.walletRepository.updateOne(walletId, walletData);
  }

  // create hold when order is being placed
  async createHold(
    userId: string,
    amount: number,
    context?: {
      orderId?: string;
      idempotencyKey?: string;
      createdBy?: string;
    },
  ): Promise<any> {
    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new HttpError(404, "Wallet not found");
    }

    if (wallet.availableBalance < amount) {
      throw new HttpError(400, "Insufficient balance");
    }

    const beforeAvailable = wallet.availableBalance || 0;
    const beforeHold = wallet.holdBalance || 0;

    const updatedWallet = await this.walletRepository.updateOne(wallet._id, {
      availableBalance: beforeAvailable - amount,
      holdBalance: beforeHold + amount,
    });

    const afterAvailable = updatedWallet?.availableBalance ?? beforeAvailable - amount;
    const afterHold = updatedWallet?.holdBalance ?? beforeHold + amount;

    await this.walletLedgerService.createTransactionRecord({
      walletId: wallet._id.toString(),
      userId,
      transactionType: "hold",
      amount,
      currency: wallet.currency || "INR",
      balanceBeforeTransaction: beforeAvailable,
      balanceAfterTransaction: afterAvailable,
      holdBeforeTransaction: beforeHold,
      holdAfterTransaction: afterHold,
      referenceId: context?.orderId,
      referenceType: "order",
      provider: "parcelx",
      idempotencyKey:
        context?.idempotencyKey ||
        `hold-${userId}-${context?.orderId || wallet._id.toString()}-${Date.now()}`,
      metadata: context?.orderId ? { orderId: context.orderId } : undefined,
      description: "Funds held for order placement",
      createdBy: context?.createdBy || userId,
    });

    return updatedWallet;
  }

  // deduct amount from available balance
  async deductAmount(userId: string, amount: number): Promise<any> {
    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new HttpError(404, "Wallet not found");
    }
    if (wallet.availableBalance < amount) {
      throw new HttpError(400, "Insufficient balance");
    }

    return await this.walletRepository.updateOne(wallet._id, {
      availableBalance: wallet.availableBalance - amount,
    });
  }
}
