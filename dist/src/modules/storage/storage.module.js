"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageModule = void 0;
const env_1 = require("../../config/env");
const storage_controller_1 = require("./storage.controller");
const cloudinary_provider_1 = require("./providers/cloudinary.provider");
const local_storage_provider_1 = require("./providers/local-storage.provider");
const storage_service_1 = require("./storage.service");
const buildStorageProvider = () => {
    switch (env_1.env.storage.driver) {
        case "cloudinary":
            return new cloudinary_provider_1.CloudinaryProvider();
        case "local":
        default:
            return new local_storage_provider_1.LocalStorageProvider();
    }
};
const storageProvider = buildStorageProvider();
const storageService = new storage_service_1.StorageService(storageProvider);
const storageController = new storage_controller_1.StorageController(storageService);
exports.storageModule = {
    storageController,
    storageService,
    storageProvider,
};
