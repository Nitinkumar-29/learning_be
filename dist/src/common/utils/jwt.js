"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashedTokenGenerator = exports.verifyToken = exports.generateToken = void 0;
// common/utils/jwt.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("../../config/env");
const JWT_SECRET = env_1.env.auth.jwtSecret;
const generateToken = (payload, options) => {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verifyToken = verifyToken;
const hashedTokenGenerator = (rawToken) => {
    const hashedToken = crypto_1.default.createHash("sha256").update(rawToken).digest("hex");
    return { hashedToken };
};
exports.hashedTokenGenerator = hashedTokenGenerator;
