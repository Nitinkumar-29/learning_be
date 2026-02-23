import { HttpError } from "../../../common/errors/http.error";
import { EmailProvider } from "../email.provider";
import { SendEmailOptions } from "../types/email.types";
import { env } from "../../../config/env";
const nodemailer = require("nodemailer");

export class NodemailerProvider implements EmailProvider {
  private transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: env.email.user,
        pass: env.email.pass,
      },
    });
  }

  async sendMail(options: SendEmailOptions): Promise<void> {
    try {
      return await this.transporter.sendMail({
        from: env.email.user,
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
