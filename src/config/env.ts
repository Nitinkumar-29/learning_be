import "dotenv/config";
import { HttpError } from "../common/errors/http.error";

const getRequiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new HttpError(500, `Missing required environment variable: ${key}`);
  }
  return value;
};

const getNumberEnv = (key: string, fallback: number): number => {
  const value = process.env[key];
  if (!value) return fallback;

  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new HttpError(500, `Invalid numeric environment variable: ${key}`);
  }
  return parsed;
};

export const env = {
  app: {
    nodeEnv: process.env.NODE_ENV || "development",
    port: getNumberEnv("PORT", 3000),
    baseUrl:
      process.env.APP_BASE_URL ||
      `http://localhost:${getNumberEnv("PORT", 3000)}`,
  },
  db: {
    mongoUri: getRequiredEnv("mongoURI"),
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || "supersecret",
  },
  email: {
    user: getRequiredEnv("EMAIL_USER"),
    pass: getRequiredEnv("EMAIL_PASS"),
  },
  storage: {
    driver: process.env.STORAGE_DRIVER || "cloudinary",
    uploadDir: process.env.UPLOAD_DIR || "uploads",
    maxFileSizeMb: getNumberEnv("MAX_FILE_SIZE_MB", 5),
  },
  cloudinary: {
    cloudName: getRequiredEnv("CLOUDINARY_CLOUD_NAME"),
    apiKey: getRequiredEnv("CLOUDINARY_API_KEY"),
    apiSecret: getRequiredEnv("CLOUDINARY_API_SECRET"),
  },
  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },
  parcelX: {
    accessKey: process.env.PARCEL_ACCESS_KEY || "",
    secretKey: process.env.PARCEL_SECRET_KEY || "",
    apiUrl: process.env.PARCELX_API_URL || "https://app.parcelx.in",
  },
};
