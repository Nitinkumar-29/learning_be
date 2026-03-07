"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const http_error_1 = require("../../common/errors/http.error");
class StorageService {
    constructor(storageProvider) {
        this.storageProvider = storageProvider;
    }
    async uploadSingle(file, folder) {
        if (!file) {
            throw new http_error_1.HttpError(400, "File is required");
        }
        return await this.storageProvider.upload({
            buffer: file.buffer,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            folder,
        });
    }
    async deleteFile(key) {
        if (!key?.trim()) {
            throw new http_error_1.HttpError(400, "File key is required");
        }
        if (key.includes("..") || key.startsWith("/") || key.startsWith("\\")) {
            throw new http_error_1.HttpError(400, "Invalid file key");
        }
        await this.storageProvider.delete(key);
    }
}
exports.StorageService = StorageService;
