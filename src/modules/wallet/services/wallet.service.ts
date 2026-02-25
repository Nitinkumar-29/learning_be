import { HttpError } from "../../../common/errors/http.error";
import {
  CreateWalletDto,
  UpdateWalletDto,
} from "../infrastructure/persistence/document/types/wallet.type";
import { WalletRepository } from "../infrastructure/persistence/abstraction/wallet.repository";
import { WalletLedgerService } from "./wallet-ledger.service";
import mongoose from "mongoose";
import {
  referenceType,
  transactionStatus,
  transactionType,
} from "../../../common/enums/wallet-ledger.enum";

export class WalletService {
  constructor(
    private walletRepository: WalletRepository,
    private walletLedgerService: WalletLedgerService,
  ) {}

  // create a new wallet for a user
  async createWallet(userId: string, walletData: CreateWalletDto): Promise<any> {
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
    walletData,
  }: {
    userId: string;
    walletData: UpdateWalletDto;
  }): Promise<any> {
    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new HttpError(404, "Wallet not found");
    }

    return await this.walletRepository.updateOne(wallet._id.toString(), walletData);
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
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new HttpError(400, "Amount must be greater than 0");
    }
    const session = await mongoose.startSession();
    try {
      let updatedWallet: any;

      await session.withTransaction(async () => {
        const wallet = await this.walletRepository.findByUserId(userId, session);
        if (!wallet) {
          throw new HttpError(404, "Wallet not found");
        }

        if (wallet.availableBalance < amount) {
          throw new HttpError(400, "Insufficient balance");
        }

        const beforeAvailable = wallet.availableBalance || 0;
        const beforeHold = wallet.holdBalance || 0;

        const walletPayload = {
          availableBalance: beforeAvailable - amount,
          holdBalance: beforeHold + amount,
        };

        updatedWallet = await this.walletRepository.updateOne(
          wallet._id.toString(),
          walletPayload,
          session,
        );

        const afterAvailable =
          updatedWallet?.availableBalance ?? beforeAvailable - amount;
        const afterHold = updatedWallet?.holdBalance ?? beforeHold + amount;
        const payload = {
          walletId: wallet._id.toString(),
          userId,
          transactionType: transactionType.HOLD,
          amount,
          currency: wallet.currency || "INR",
          // walletOperationType: walletOperationType.HOLD,
          balanceBeforeTransaction: beforeAvailable,
          balanceAfterTransaction: afterAvailable,
          holdBeforeTransaction: beforeHold,
          holdAfterTransaction: afterHold,
          transactionStatus: transactionStatus.PENDING,
          referenceId: context?.orderId,
          referenceType: referenceType.ORDER,
          provider: "parcelx",
          idempotencyKey:
            context?.idempotencyKey ||
            `${transactionType.HOLD}-${userId}-${context?.orderId || wallet._id.toString()}-${Date.now()}`,
          metadata: context?.orderId ? { orderId: context.orderId } : undefined,
          description: "Funds held for order placement",
          createdBy: context?.createdBy || userId,
        };
        await this.walletLedgerService.createTransactionRecord(payload, session);
      });

      return updatedWallet;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(500, "Failed to create hold");
    } finally {
      await session.endSession();
    }
  }

  // deduct amount from available balance
  async deductAmount(userId: string, amount: number): Promise<any> {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new HttpError(400, "Amount must be greater than 0");
    }
    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new HttpError(404, "Wallet not found");
    }
    if (wallet.availableBalance < amount) {
      throw new HttpError(400, "Insufficient balance");
    }

    return await this.walletRepository.updateOne(wallet._id.toString(), {
      availableBalance: wallet.availableBalance - amount,
    });
  }
}
