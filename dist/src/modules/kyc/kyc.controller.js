"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycConroller = void 0;
class KycConroller {
    constructor(kycService) {
        this.kycService = kycService;
        this.registerKycDetails = this.registerKycDetails.bind(this);
        this.listRegisteredKycs = this.listRegisteredKycs.bind(this);
        this.registerBankKycDetails = this.registerBankKycDetails.bind(this);
        this.fetchRegisteredKycDetails = this.fetchRegisteredKycDetails.bind(this);
    }
    async registerKycDetails(req, res, next) {
        try {
            const userId = req?.user?.id;
            const payload = {
                ...req.body,
                userId,
            };
            const result = await this.kycService.registerKycDetails(payload);
            res.status(201).json({
                message: "KYC details submitted successfully",
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async registerBankKycDetails(req, res, next) {
        try {
            const userId = req?.user?.id;
            const payload = {
                ...req.body,
                userId,
            };
            const result = await this.kycService.registerBankKycDetails(payload);
            res.status(201).json({
                message: "Bank KYC details submitted successfully",
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async fetchRegisteredKycDetails(req, res, next) {
        try {
            const userId = req?.user?.id;
            const result = await this.kycService.fetchRegisteredKycDetails(userId);
            res.status(200).json({
                message: "Registered KYC details fetched successfully",
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async fetchRegisteredBankKycDetails(req, res, next) {
        try {
            const userId = req?.user?.id;
            const result = await this.kycService.fetchRegisteredBankKycDetails(userId);
            res.status(200).json({
                message: "Registered Bank KYC details fetched successfully",
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateKycDetails(req, res, next) {
        try {
            const userId = req?.user?.id;
            const data = {
                ...req.body,
                userId,
            };
            const result = await this.kycService.updateKycDetails(userId, data);
            res.status(200).json({
                message: "KYC details updated successfully",
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async listRegisteredKycs(req, res, next) {
        try {
            const query = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                search: req.query.search || "",
            };
            const result = await this.kycService.listRegisteredKycs(query);
            res.status(200).json({
                message: "Registered kycs fetched successfully",
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteKycDetails(req, res, next) {
        try {
            const userId = req?.user?.id;
            // Implement delete logic here
            const result = await this.kycService.updateKycDetails(userId, {
                isDeleted: true,
            });
            res.status(200).json({
                message: "KYC details deleted successfully",
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.KycConroller = KycConroller;
