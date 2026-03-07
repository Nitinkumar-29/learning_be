"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryProvider = void 0;
const http_error_1 = require("../../../common/errors/http.error");
const cloudinary_1 = require("../../../config/storageTypes/cloudinary");
class CloudinaryProvider {
    async upload(input) {
        try {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary_1.cloudinary.uploader.upload_stream({
                    folder: input.folder,
                    resource_type: "auto",
                }, (error, uploadResult) => {
                    if (error || !uploadResult) {
                        reject(error ?? new Error("Cloudinary upload failed"));
                        return;
                    }
                    resolve(uploadResult);
                });
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
        }
        catch (error) {
            throw new http_error_1.HttpError(500, "Failed to upload file to Cloudinary");
        }
    }
    async delete(_key) {
        throw new http_error_1.HttpError(501, "Cloudinary file deletion is not implemented yet.");
    }
}
exports.CloudinaryProvider = CloudinaryProvider;
