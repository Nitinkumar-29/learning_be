"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
class WalletController {
    constructor(walletService) {
        this.walletService = walletService;
        this.walletService = walletService;
        this.createWallet = this.createWallet.bind(this);
        this.getWallet = this.getWallet.bind(this);
        this.updateWallet = this.updateWallet.bind(this);
    }
    // create a new wallet for a user
    async createWallet(req, res, next) {
        try {
            const walletPayload = req.body;
            const userId = req.user?.id;
            const wallet = await this.walletService.createWallet(userId, walletPayload);
            res.status(201).json({
                message: "Wallet created successfully",
                success: true,
                data: wallet,
            });
        }
        catch (error) {
            next(error);
        }
    }
    //   get wallet details for a user
    async getWallet(req, res, next) {
        try {
            const userId = req.user?.id;
            const wallet = await this.walletService.getWallet(userId);
            res.status(200).json({
                message: "Wallet details fetched successfully",
                success: true,
                data: wallet,
            });
        }
        catch (error) {
            next(error);
        }
    }
    //   update wallet details for a user
    async updateWallet(req, res, next) {
        try {
            const walletPayload = req.body;
            const userId = req.user?.id;
            const wallet = await this.walletService.updateWallet({
                userId,
                walletData: walletPayload,
            });
            res.status(200).json({
                message: "Wallet updated successfully",
                success: true,
                data: wallet,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.WalletController = WalletController;
