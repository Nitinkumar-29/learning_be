import { UploadFileInput, UploadedFile } from "./types/storage.types";

export interface StorageProvider {
  upload(input: UploadFileInput): Promise<UploadedFile>;
  delete(key: string): Promise<void>;
}
