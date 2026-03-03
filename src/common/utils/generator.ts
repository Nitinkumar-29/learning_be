import crypto from "crypto";

export const generateRefId = (): string => {
  // 14 chars timestamp(base36 uppercase) + 21 chars random(0-9A-Z) = 35
  const ts = Date.now().toString(36).toUpperCase().padStart(14, "0");
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const bytes = crypto.randomBytes(21);
  let rand = "";
  for (let i = 0; i < 21; i++) {
    rand += chars[bytes[i] % chars.length];
  }

  return `${ts}${rand}`; // exactly 35 chars
};
