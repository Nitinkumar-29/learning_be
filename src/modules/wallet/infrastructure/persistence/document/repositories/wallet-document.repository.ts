// this document repository is responsible for handling the database operations related to the wallet document in MongoDB. It implements the WalletRepository interface and provides methods for creating, finding, updating, and deleting wallet documents in the database.
// this uses abstraction layer to decouple the database operations from the business logic, allowing for easier maintenance and testing of the codebase. The implementation of this repository will depend on the specific database technology being used (e.g., MongoDB, PostgreSQL, etc.) and will contain the necessary queries and operations to interact with the database effectively.

import { ClientSession } from "mongoose";
import { WalletRepository } from "../../abstraction/wallet.repository";
import { WalletModel } from "../schemas/wallet.schema";

export class WalletDocumentRepository extends WalletRepository {
  async create(
    userId: string,
    walletData: Record<string, unknown>,
    session?: ClientSession,
  ): Promise<any> {
    const [wallet] = await WalletModel.create([{ userId, ...walletData }], {
      session,
    });
    return wallet;
  }

  async findByUserId(userId: string, session?: ClientSession): Promise<any> {
    return await WalletModel.findOne({ userId }).session(session ?? null);
  }

  async findById(walletId: string, session?: ClientSession): Promise<any> {
    return await WalletModel.findById(walletId).session(session ?? null);
  }

  async updateOne(
    walletId: string,
    walletData: Record<string, unknown>,
    session?: ClientSession,
  ): Promise<any> {
    return await WalletModel.findByIdAndUpdate(walletId, walletData, {
      new: true,
      session,
    });
  }

  async delete(walletId: string, session?: ClientSession): Promise<void> {
    await WalletModel.findByIdAndDelete(walletId, { session });
  }
}
