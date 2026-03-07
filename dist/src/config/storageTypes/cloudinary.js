"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = void 0;
const env_1 = require("../env");
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
cloudinary_1.v2.config({
    cloud_name: env_1.env.cloudinary.cloudName,
    api_key: env_1.env.cloudinary.apiKey,
    api_secret: env_1.env.cloudinary.apiSecret,
});
