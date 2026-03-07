"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const env_1 = require("../config/env");
const http_error_1 = require("../common/errors/http.error");
const auth_module_1 = require("../modules/auth/auth.module");
const storage_module_1 = require("../modules/storage/storage.module");
const router = express_1.default.Router();
const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
];
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: env_1.env.storage.maxFileSizeMb * 1024 * 1024,
    },
    fileFilter: (_req, file, cb) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new http_error_1.HttpError(400, "Only JPG, PNG, WEBP, and PDF files are allowed"));
        }
        cb(null, true);
    },
});
const { authMiddleware } = auth_module_1.authModule;
const { storageController } = storage_module_1.storageModule;
router.post("/upload", authMiddleware.protect, upload.single("file"), storageController.uploadSingle);
router.delete("/delete", authMiddleware.protect, storageController.deleteFile);
exports.storageRoutes = router;
