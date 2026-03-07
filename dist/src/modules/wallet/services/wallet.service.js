"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const http_error_1 = require("../../../common/errors/http.error");
const mongoose_1 = __importDefault(require("mongoose"));
const wallet_ledger_enum_1 = require("../../../common/enums/wallet-ledger.enum");
class WalletService {
    constructor(walletRepository, walletLedgerService) {
        this.walletRepository = walletRepository;
        this.walletLedgerService = walletLedgerService;
    }
    // create a new wallet for a user
    async createWallet(userId, walletData) {
        const user = await this.walletRepository.findByUserId(userId);
        if (user) {
            throw new http_error_1.HttpError(400, "User already has a wallet");
        }
        return this.walletRepository.create(userId, walletData);
    }
    // get wallet details for a user
    async getWallet(userId) {
        const wallet = await this.walletRepository.findByUserId(userId);
        if (!wallet) {
            throw new http_error_1.HttpError(404, "Wallet not found");
        }
        return wallet;
    }
    // update wallet details for a user
    async updateWallet({ userId, walletData, }) {
        const wallet = await this.walletRepository.findByUserId(userId);
        if (!wallet) {
            throw new http_error_1.HttpError(404, "Wallet not found");
        }
        return await this.walletRepository.updateOne(wallet._id.toString(), walletData);
    }
    // create hold when order is being placed
    async createHold(userId, amount, context) {
        if (!Number.isFinite(amount) || amount <= 0) {
            throw new http_error_1.HttpError(400, "Amount must be greater than 0");
        }
        const session = await mongoose_1.default.startSession();
        try {
            let updatedWallet;
            await session.withTransaction(async () => {
                const wallet = await this.walletRepository.findByUserId(userId, session);
                if (!wallet) {
                    throw new http_error_1.HttpError(404, "Wallet not found");
                }
                if (wallet.availableBalanceInPaise < amount) {
                    throw new http_error_1.HttpError(400, "Insufficient balance");
                }
                const beforeAvailable = wallet.availableBalanceInPaise || 0;
                const beforeHold = wallet.holdBalanceInPaise || 0;
                const walletPayload = {
                    availableBalanceInPaise: beforeAvailable - amount,
                    holdBalanceInPaise: beforeHold + amount,
                };
                updatedWallet = await this.walletRepository.updateOne(wallet._id.toString(), walletPayload, session);
                const afterAvailable = updatedWallet?.availableBalanceInPaise ?? beforeAvailable - amount;
                const afterHold = updatedWallet?.holdBalanceInPaise ?? beforeHold + amount;
                const payload = {
                    walletId: wallet._id.toString(),
                    userId,
                    transactionType: wallet_ledger_enum_1.transactionType.HOLD,
                    amount,
                    currency: wallet.currency || "INR",
                    // walletOperationType: walletOperationType.HOLD,
                    balanceBeforeTransaction: beforeAvailable,
                    balanceAfterTransaction: afterAvailable,
                    holdBeforeTransaction: beforeHold,
                    holdAfterTransaction: afterHold,
                    transactionStatus: wallet_ledger_enum_1.transactionStatus.PENDING,
                    referenceId: context?.orderId,
                    referenceType: wallet_ledger_enum_1.referenceType.ORDER,
                    provider: "parcelx",
                    idempotencyKey: context?.idempotencyKey ||
                        `${wallet_ledger_enum_1.transactionType.HOLD}-${userId}-${context?.orderId || wallet._id.toString()}-${Date.now()}`,
                    metadata: context?.orderId ? { orderId: context.orderId } : undefined,
                    description: "Funds held for order placement",
                    createdBy: context?.createdBy || userId,
                };
                await this.walletLedgerService.createTransactionRecord(payload, session);
            });
            return updatedWallet;
        }
        catch (error) {
            if (error instanceof http_error_1.HttpError) {
                throw error;
            }
            throw new http_error_1.HttpError(500, "Failed to create hold");
        }
        finally {
            await session.endSession();
        }
    }
    // deduct amount from available balance
    async deductAmount(userId, amount) {
        if (!Number.isFinite(amount) || amount <= 0) {
            throw new http_error_1.HttpError(400, "Amount must be greater than 0");
        }
        const wallet = await this.walletRepository.findByUserId(userId);
        if (!wallet) {
            throw new http_error_1.HttpError(404, "Wallet not found");
        }
        if (wallet.availableBalanceInPaise < amount) {
            throw new http_error_1.HttpError(400, "Insufficient balance");
        }
        return await this.walletRepository.updateOne(wallet._id.toString(), {
            availableBalanceInPaise: wallet.availableBalanceInPaise - amount,
        });
    }
    async creditFromPayment({ userId, amountInPaise, referenceId, provider, providerReferenceId, idempotencyKey, metadata, createdBy, }, session) {
        if (!Number.isFinite(amountInPaise) || amountInPaise <= 0) {
            throw new http_error_1.HttpError(400, "Amount must be greater than 0");
        }
        const executeCredit = async (activeSession) => {
            const wallet = await this.walletRepository.findByUserId(userId, activeSession);
            if (!wallet) {
                throw new http_error_1.HttpError(404, "Wallet not found");
            }
            const beforeAvailable = wallet.availableBalanceInPaise || 0;
            const beforeHold = wallet.holdBalanceInPaise || 0;
            const afterAvailable = beforeAvailable + amountInPaise;
            const totalCredited = (wallet.totalCreditedInPaise || 0) + amountInPaise;
            const updatedWallet = await this.walletRepository.updateOne(wallet._id.toString(), {
                availableBalanceInPaise: afterAvailable,
                totalCreditedInPaise: totalCredited,
            }, activeSession);
            await this.walletLedgerService.createTransactionRecord({
                walletId: wallet._id.toString(),
                userId,
                transactionType: wallet_ledger_enum_1.transactionType.CREDIT,
                transactionStatus: wallet_ledger_enum_1.transactionStatus.COMPLETED,
                amount: amountInPaise,
                currency: wallet.currency || "INR",
                balanceBeforeTransaction: beforeAvailable,
                balanceAfterTransaction: afterAvailable,
                holdBeforeTransaction: beforeHold,
                holdAfterTransaction: beforeHold,
                referenceId,
                referenceType: wallet_ledger_enum_1.referenceType.WALLET_TOPUP,
                provider,
                providerReferenceId,
                idempotencyKey,
                metadata,
                description: "Wallet credited from payment webhook",
                createdBy: createdBy || userId,
            }, activeSession);
            return updatedWallet;
        };
        if (session) {
            return executeCredit(session);
        }
        const localSession = await mongoose_1.default.startSession();
        try {
            let result;
            try {
                await localSession.withTransaction(async () => {
                    result = await executeCredit(localSession);
                });
            }
            catch (error) {
                const message = String(error?.message || "");
                const transactionUnsupported = message.includes("Transaction numbers are only allowed on a replica set member or mongos") || message.includes("replica set");
                if (!transactionUnsupported) {
                    throw error;
                }
                // Fallback for standalone MongoDB in local/dev.
                result = await executeCredit();
            }
            return result;
        }
        finally {
            await localSession.endSession();
        }
    }
}
exports.WalletService = WalletService;
