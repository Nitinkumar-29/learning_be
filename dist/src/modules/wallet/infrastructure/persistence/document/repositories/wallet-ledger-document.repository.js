"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletLedgerDocumentRepository = void 0;
const wallet_ledger_repository_1 = require("../../abstraction/wallet-ledger.repository");
const wallet_ledger_schema_1 = require("../schemas/wallet-ledger.schema");
class WalletLedgerDocumentRepository extends wallet_ledger_repository_1.WalletLedgerRepository {
    async create(data, session) {
        const [doc] = await wallet_ledger_schema_1.WalletLedgerModel.create([data], { session });
        return doc;
    }
}
exports.WalletLedgerDocumentRepository = WalletLedgerDocumentRepository;
