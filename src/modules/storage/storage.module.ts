import { env } from "../../config/env";
import { StorageController } from "./storage.controller";
import { CloudinaryProvider } from "./providers/cloudinary.provider";
import { LocalStorageProvider } from "./providers/local-storage.provider";
import { StorageProvider } from "./storage.provider";
import { StorageService } from "./storage.service";

const buildStorageProvider = (): StorageProvider => {
  switch (env.storage.driver) {
    case "cloudinary":
      return new CloudinaryProvider();
    case "local":
    default:
      return new LocalStorageProvider();
  }
};

const storageProvider = buildStorageProvider();
const storageService = new StorageService(storageProvider);
const storageController = new StorageController(storageService);

export const storageModule = {
  storageController,
  storageService,
  storageProvider,
};
