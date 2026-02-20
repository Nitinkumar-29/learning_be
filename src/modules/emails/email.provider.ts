import { SendEmailOptions } from "./types/email.types";

export interface EmailProvider {
  sendMail(options: SendEmailOptions): Promise<void>;
}
