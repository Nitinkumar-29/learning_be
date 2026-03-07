"use strict";
// this document repository is responsible for handling the database operations related to the wallet document in MongoDB. It implements the WalletRepository interface and provides methods for creating, finding, updating, and deleting wallet documents in the database.
// this uses abstraction layer to decouple the database operations from the business logic, allowing for easier maintenance and testing of the codebase. The implementation of this repository will depend on the specific database technology being used (e.g., MongoDB, PostgreSQL, etc.) and will contain the necessary queries and operations to interact with the database effectively.
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletDocumentRepository = void 0;
const wallet_repository_1 = require("../../abstraction/wallet.repository");
const wallet_schema_1 = require("../schemas/wallet.schema");
class WalletDocumentRepository extends wallet_repository_1.WalletRepository {
    async create(userId, walletData, session) {
        const [wallet] = await wallet_schema_1.WalletModel.create([{ userId, ...walletData }], {
            session,
        });
        return wallet;
    }
    async findByUserId(userId, session) {
        return await wallet_schema_1.WalletModel.findOne({ userId }).session(session ?? null);
    }
    async findById(walletId, session) {
        return await wallet_schema_1.WalletModel.findById(walletId).session(session ?? null);
    }
    async updateOne(walletId, walletData, session) {
        return await wallet_schema_1.WalletModel.findByIdAndUpdate(walletId, walletData, {
            returnDocument: "after",
            session,
        });
    }
    async delete(walletId, session) {
        await wallet_schema_1.WalletModel.findByIdAndDelete(walletId, { session });
    }
}
exports.WalletDocumentRepository = WalletDocumentRepository;
