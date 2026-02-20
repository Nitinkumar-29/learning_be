// common/utils/jwt.ts
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const generateToken = (payload: object, options?: any) => {
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

export const hashedTokenGenerator = (rawToken: string) => {
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  return { hashedToken };
};
