import { HttpError } from "../../common/errors/http.error";
import { StorageProvider } from "./storage.provider";
import { UploadedFile } from "./types/storage.types";

export class StorageService {
  constructor(private readonly storageProvider: StorageProvider) {}

  async uploadSingle(file: Express.Multer.File, folder?: string): Promise<UploadedFile> {
    if (!file) {
      throw new HttpError(400, "File is required");
    }

    return await this.storageProvider.upload({
      buffer: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      folder,
    });
  }

  async deleteFile(key: string): Promise<void> {
    if (!key?.trim()) {
      throw new HttpError(400, "File key is required");
    }
    if (key.includes("..") || key.startsWith("/") || key.startsWith("\\")) {
      throw new HttpError(400, "Invalid file key");
    }
    await this.storageProvider.delete(key);
  }
}
