import express from "express";
import multer from "multer";
import { env } from "../config/env";
import { HttpError } from "../common/errors/http.error";
import { authModule } from "../modules/auth/auth.module";
import { storageModule } from "../modules/storage/storage.module";

const router = express.Router();
const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.storage.maxFileSizeMb * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new HttpError(400, "Only JPG, PNG, WEBP, and PDF files are allowed"));
    }
    cb(null, true);
  },
});

const { authMiddleware } = authModule;
const { storageController } = storageModule;

router.post(
  "/upload",
  authMiddleware.protect,
  upload.single("file"),
  storageController.uploadSingle,
);
router.delete("/delete", authMiddleware.protect, storageController.deleteFile);

export const storageRouter = router;
