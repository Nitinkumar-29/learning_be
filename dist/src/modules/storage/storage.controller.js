"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageController = void 0;
class StorageController {
    constructor(storageService) {
        this.storageService = storageService;
        this.uploadSingle = this.uploadSingle.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
    }
    async uploadSingle(req, res, next) {
        try {
            const file = req.file;
            const folder = req.body?.folder || "general";
            const result = await this.storageService.uploadSingle(file, folder);
            res.status(201).json({
                success: true,
                message: "File uploaded successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteFile(req, res, next) {
        try {
            const key = req.body?.key;
            await this.storageService.deleteFile(key);
            res.status(200).json({
                success: true,
                message: "File deleted successfully",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.StorageController = StorageController;
