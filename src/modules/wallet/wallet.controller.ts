import { NextFunction, Request, Response } from "express";
import { WalletService } from "./services/wallet.service";
import { CreateWalletDto } from "./infrastructure/persistence/document/types/wallet.type";

export class WalletController {
  constructor(private walletService: WalletService) {
    this.walletService = walletService;
    this.createWallet = this.createWallet.bind(this);
    this.getWallet = this.getWallet.bind(this);
    this.updateWallet = this.updateWallet.bind(this);
  }

  // create a new wallet for a user
  async createWallet(req: Request, res: Response, next: NextFunction) {
    try {
      const walletPayload = req.body as CreateWalletDto;
      console.log(walletPayload, "walletPayload");
      const userId = req.user?.id as unknown as string;
      const wallet = await this.walletService.createWallet(
        userId!,
        walletPayload,
      );
      res.status(201).json({
        message: "Wallet created successfully",
        success: true,
        data: wallet,
      });
    } catch (error) {
      next(error);
    }
  }

  //   get wallet details for a user
  async getWallet(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as unknown as string;
      const wallet = await this.walletService.getWallet(userId!);
      res.status(200).json({
        message: "Wallet details fetched successfully",
        success: true,
        data: wallet,
      });
    } catch (error) {
      next(error);
    }
  }

  //   update wallet details for a user
  async updateWallet(req: Request, res: Response, next: NextFunction) {
    try {
      const walletPayload = req.body as CreateWalletDto;
      const userId = req.user?.id as unknown as string;
      const walletId = req.params.id as unknown as string;
      console.log(walletId, "walletPayload");
      const wallet = await this.walletService.updateWallet({
        userId,
        walletId,
        walletData: walletPayload,
      });
      res.status(200).json({
        message: "Wallet updated successfully",
        success: true,
        data: wallet,
      });
    } catch (error) {
      next(error);
    }
  }

  //   deduct fund from wallet for a user when a transaction is made
}
