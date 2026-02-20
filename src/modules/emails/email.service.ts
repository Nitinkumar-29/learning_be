import { EmailProvider } from "./email.provider";
import { resetPasswordTemplate } from "./templates/reset-password.template";

export class EmailService {
  constructor(private readonly emailProvider: EmailProvider) {}

  async sendResetPasswordEmail(
    email: string,
    resetToken: string,
    requestOriginUrl: string,
  ) {
    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Email credentials not configured");
      }
      const resetLink = `${requestOriginUrl}/reset-password?email=${email}&token=${resetToken}`;
      const html = resetPasswordTemplate(resetLink);
      await this.emailProvider.sendMail({
        to: email,
        subject: "Password Reset Request",
        html,
      });
    } catch (error) {
      throw error;
    }
  }
}
