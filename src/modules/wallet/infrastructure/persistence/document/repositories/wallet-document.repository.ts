// this document repository is responsible for handling the database operations related to the wallet document in MongoDB. It implements the WalletRepository interface and provides methods for creating, finding, updating, and deleting wallet documents in the database.
// this uses abstraction layer to decouple the database operations from the business logic, allowing for easier maintenance and testing of the codebase. The implementation of this repository will depend on the specific database technology being used (e.g., MongoDB, PostgreSQL, etc.) and will contain the necessary queries and operations to interact with the database effectively.

import { Types } from "mongoose";
import { WalletRepository } from "../../wallet.repository";
import { WalletModel } from "../schemas/wallet.schema";

export class WalletDocumentRepository extends WalletRepository {
  async create(userId: string, walletData: any): Promise<any> {
    // implementation for creating a wallet document in the database
    return await WalletModel.create({ userId, ...walletData });
  }
  async findByUserId(userId: string): Promise<any> {
    // find wallet by userId
    return await WalletModel.findOne({ userId });
  }

  async findById(userId: unknown): Promise<any> {
    // implementation for finding a wallet document by user ID in the database
    return await WalletModel.findById(userId);
  }
  async updateOne(userId: string, walletData: any): Promise<any> {
    // implementation for updating a wallet document in the database
    return await WalletModel.findByIdAndUpdate(userId, walletData, {
      new: true,
    });
  }
  async delete(userId: string): Promise<void> {
    // implementation for deleting a wallet document from the database
    await WalletModel.findByIdAndDelete(userId);
  }
}
