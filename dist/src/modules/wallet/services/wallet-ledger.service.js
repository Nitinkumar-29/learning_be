"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletLedgerService = void 0;
const http_error_1 = require("../../../common/errors/http.error");
const wallet_ledger_type_1 = require("../infrastructure/persistence/document/types/wallet-ledger.type");
class WalletLedgerService {
    constructor(walletLedgerRepository) {
        this.walletLedgerRepository = walletLedgerRepository;
    }
    // create a transaction record for a wallet operation (credit/debit/hold/release/refund)
    async createTransactionRecord(data, session) {
        const payload = wallet_ledger_type_1.createWalletLedgerSchema.parse(data);
        try {
            return await this.walletLedgerRepository.create(payload, session);
        }
        catch (error) {
            if (error?.code === 11000) {
                throw new http_error_1.HttpError(409, "Duplicate transaction for this idempotency key");
            }
            throw new http_error_1.HttpError(500, "Failed to create wallet ledger transaction");
        }
    }
}
exports.WalletLedgerService = WalletLedgerService;
