"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const morgan_1 = __importDefault(require("morgan"));
exports.requestLogger = (0, morgan_1.default)((tokens, req, res) => {
    return [
        "\x1b[36m📡\x1b[0m",
        tokens.method(req, res),
        tokens.url(req, res),
        "\x1b[33m" + tokens.status(req, res) + "\x1b[0m",
        tokens["response-time"](req, res) + " ms",
    ].join(" ");
});
