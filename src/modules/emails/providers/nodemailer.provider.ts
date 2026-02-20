import { HttpError } from "../../../common/errors/http.error";
import { EmailProvider } from "../email.provider";
import { SendEmailOptions } from "../types/email.types";
const nodemailer = require("nodemailer");

export class NodemailerProvider implements EmailProvider {
  private transporter;
  constructor() {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new HttpError(500, "Email credentials not configured properly");
    }

    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendMail(options: SendEmailOptions): Promise<void> {
    try {
      return await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
    } catch (error: any) {
      throw new HttpError(500, error);
    }
  }
}
