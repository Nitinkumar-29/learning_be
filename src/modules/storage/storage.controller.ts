import { NextFunction, Request, Response } from "express";
import { StorageService } from "./storage.service";

export class StorageController {
  constructor(private readonly storageService: StorageService) {
    this.uploadSingle = this.uploadSingle.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
  }

  async uploadSingle(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file as Express.Multer.File | undefined;
      const folder = (req.body?.folder as string) || "general";
      const result = await this.storageService.uploadSingle(file as Express.Multer.File, folder);

      res.status(201).json({
        success: true,
        message: "File uploaded successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteFile(req: Request, res: Response, next: NextFunction) {
    try {
      const key = req.body?.key as string;
      await this.storageService.deleteFile(key);

      res.status(200).json({
        success: true,
        message: "File deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
