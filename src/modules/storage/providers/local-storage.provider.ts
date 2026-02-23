import path from "path";
import { promises as fs } from "fs";
import crypto from "crypto";
import { StorageProvider } from "../storage.provider";
import { UploadFileInput, UploadedFile } from "../types/storage.types";
import { env } from "../../../config/env";

export class LocalStorageProvider implements StorageProvider {
  private readonly providerName = "local";

  private sanitize(value: string): string {
    return value.replace(/[^a-zA-Z0-9_.-]/g, "-");
  }

  private buildTarget(folder?: string) {
    const safeFolder = folder ? this.sanitize(folder) : "general";
    const dirPath = path.resolve(env.storage.uploadDir, safeFolder);
    return { safeFolder, dirPath };
  }

  async upload(input: UploadFileInput): Promise<UploadedFile> {
    const { safeFolder, dirPath } = this.buildTarget(input.folder);
    await fs.mkdir(dirPath, { recursive: true });

    const ext = path.extname(input.originalName) || "";
    const baseName = this.sanitize(path.basename(input.originalName, ext));
    const fileName = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}-${baseName}${ext}`;
    const absolutePath = path.join(dirPath, fileName);

    await fs.writeFile(absolutePath, input.buffer);

    const key = `${safeFolder}/${fileName}`;
    const url = `${env.app.baseUrl}/uploads/${key}`;

    return {
      key,
      url,
      provider: this.providerName,
      originalName: input.originalName,
      mimeType: input.mimeType,
      size: input.size,
    };
  }

  async delete(key: string): Promise<void> {
    const absolutePath = path.resolve(env.storage.uploadDir, key);
    try {
      await fs.unlink(absolutePath);
    } catch (error: any) {
      if (error?.code !== "ENOENT") {
        throw error;
      }
    }
  }
}
