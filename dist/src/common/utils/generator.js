"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefId = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateRefId = () => {
    // 14 chars timestamp(base36 uppercase) + 21 chars random(0-9A-Z) = 35
    const ts = Date.now().toString(36).toUpperCase().padStart(14, "0");
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const bytes = crypto_1.default.randomBytes(21);
    let rand = "";
    for (let i = 0; i < 21; i++) {
        rand += chars[bytes[i] % chars.length];
    }
    return `${ts}${rand}`; // exactly 35 chars
};
exports.generateRefId = generateRefId;
