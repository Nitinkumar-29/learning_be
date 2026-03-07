"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageProvider = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("../../../config/env");
class LocalStorageProvider {
    constructor() {
        this.providerName = "local";
    }
    sanitize(value) {
        return value.replace(/[^a-zA-Z0-9_.-]/g, "-");
    }
    buildTarget(folder) {
        const safeFolder = folder ? this.sanitize(folder) : "general";
        const dirPath = path_1.default.resolve(env_1.env.storage.uploadDir, safeFolder);
        return { safeFolder, dirPath };
    }
    async upload(input) {
        const { safeFolder, dirPath } = this.buildTarget(input.folder);
        await fs_1.promises.mkdir(dirPath, { recursive: true });
        const ext = path_1.default.extname(input.originalName) || "";
        const baseName = this.sanitize(path_1.default.basename(input.originalName, ext));
        const fileName = `${Date.now()}-${crypto_1.default.randomBytes(4).toString("hex")}-${baseName}${ext}`;
        const absolutePath = path_1.default.join(dirPath, fileName);
        await fs_1.promises.writeFile(absolutePath, input.buffer);
        const key = `${safeFolder}/${fileName}`;
        const url = `${env_1.env.app.baseUrl}/uploads/${key}`;
        return {
            key,
            url,
            provider: this.providerName,
            originalName: input.originalName,
            mimeType: input.mimeType,
            size: input.size,
        };
    }
    async delete(key) {
        const absolutePath = path_1.default.resolve(env_1.env.storage.uploadDir, key);
        try {
            await fs_1.promises.unlink(absolutePath);
        }
        catch (error) {
            if (error?.code !== "ENOENT") {
                throw error;
            }
        }
    }
}
exports.LocalStorageProvider = LocalStorageProvider;
