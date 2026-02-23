import { KycService } from "./kyc.service";
import { NextFunction, Request, Response } from "express";

export class KycConroller {
  constructor(private readonly kycService: KycService) {
    this.registerKycDetails = this.registerKycDetails.bind(this);
    this.listRegisteredKycs = this.listRegisteredKycs.bind(this);
    this.registerBankKycDetails = this.registerBankKycDetails.bind(this);
    this.fetchRegisteredKycDetails = this.fetchRegisteredKycDetails.bind(this);
  }

  async registerKycDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req?.user?.id as any;
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
    } catch (error) {
      next(error);
    }
  }

  async registerBankKycDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req?.user?.id as any;
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
    } catch (error) {
      next(error);
    }
  }

  async fetchRegisteredKycDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req?.user?.id as any;
      const result = await this.kycService.fetchRegisteredKycDetails(userId);
      res.status(200).json({
        message: "Registered KYC details fetched successfully",
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async fetchRegisteredBankKycDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req?.user?.id as any;
      const result =
        await this.kycService.fetchRegisteredBankKycDetails(userId);
      res.status(200).json({
        message: "Registered Bank KYC details fetched successfully",
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateKycDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req?.user?.id as any;
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
    } catch (error) {
      next(error);
    }
  }

  async listRegisteredKycs(req: Request, res: Response, next: NextFunction) {
    try {
      const query = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        search: (req.query.search as string) || "",
      };
      const result = await this.kycService.listRegisteredKycs(query);
      res.status(200).json({
        message: "Registered kycs fetched successfully",
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteKycDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req?.user?.id as any;
      // Implement delete logic here
      const result = await this.kycService.updateKycDetails(userId, {
        isDeleted: true,
      });
      res.status(200).json({
        message: "KYC details deleted successfully",
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
