import { HttpError } from "../../../common/errors/http.error";
import { cloudinary } from "../../../config/storageTypes/cloudinary";
import { StorageProvider } from "../storage.provider";
import { UploadFileInput, UploadedFile } from "../types/storage.types";

export class CloudinaryProvider implements StorageProvider {
  async upload(input: UploadFileInput): Promise<UploadedFile> {
    try {
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: input.folder,
            resource_type: "auto",
          },
          (error, uploadResult) => {
            if (error || !uploadResult) {
              reject(error ?? new Error("Cloudinary upload failed"));
              return;
            }
            resolve(uploadResult);
          },
        );

        stream.end(input.buffer);
      });

      return {
        key: result.public_id,
        url: result.secure_url,
        provider: "cloudinary",
        originalName: input.originalName,
        mimeType: input.mimeType,
        size: input.size,
      };
    } catch (error) {
      throw new HttpError(500, "Failed to upload file to Cloudinary");
    }
  }

  async delete(_key: string): Promise<void> {
    throw new HttpError(
      501,
      "Cloudinary file deletion is not implemented yet.",
    );
  }
}
