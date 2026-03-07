"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodemailerProvider = void 0;
const http_error_1 = require("../../../common/errors/http.error");
const env_1 = require("../../../config/env");
const nodemailer = require("nodemailer");
class NodemailerProvider {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: env_1.env.email.user,
                pass: env_1.env.email.pass,
            },
        });
    }
    async sendMail(options) {
        try {
            return await this.transporter.sendMail({
                from: env_1.env.email.user,
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text,
            });
        }
        catch (error) {
            throw new http_error_1.HttpError(500, error);
        }
    }
}
exports.NodemailerProvider = NodemailerProvider;
