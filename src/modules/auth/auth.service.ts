import { HttpError } from "../../common/errors/http.error";
import { generateToken, hashedTokenGenerator } from "../../common/utils/jwt";
import {
  LoginDto,
  RegisterDto,
} from "./infrastructure/persistence/document/types/auth.types";
import { AuthRepository } from "./infrastructure/persistence/document/auth.repository";
import { EmailService } from "../emails/email.service";
const bcrypt = require("bcryptjs");
import crypto from "crypto";

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly emailService: EmailService,
  ) {}

  async registerUser(registerDto: RegisterDto) {
    const hashPassword = await bcrypt.hash(registerDto.password, 10);

    return this.authRepository.createUser({
      ...registerDto,
      password: hashPassword,
    });
  }

  async login(loginDto: LoginDto): Promise<{ userData: any; token: string }> {
    const user = await this.authRepository.findByEmail(loginDto.email);

    if (!user) {
      throw new HttpError(401, "Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password.trim(),
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpError(401, "Invalid credentials");
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });

    return {
      userData: user,
      token,
    };
  }

  async getProfile(userId: string) {
    const user = await this.authRepository.findById(userId);
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    return user;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.authRepository.findById(userId.toString());
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    // check both current and new password are not the same
    if (currentPassword.toString() === newPassword.toString()) {
      throw new HttpError(
        400,
        "Please provide a different password, you cannot reuse the current password",
      );
    }

    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new HttpError(400, "Current password is incorrect");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    return await this.authRepository.updateUser(userId.toString(), {
      password: hashedNewPassword,
      tokenVersion: user.tokenVersion + 1,
    });
  }

  async forgotPassoword(email: string, origin: string) {
    const user = await this.authRepository.findByEmail(email);
    console.log("User found for forgot password:", user);
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    // generate a reset token and send email to user with the reset link
    const rawToken = crypto.randomBytes(32).toString("hex");
    const { hashedToken } = hashedTokenGenerator(rawToken);
    await this.authRepository.updateUser(user._id.toString(), {
      passwordResetToken: hashedToken,
      passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000),
    });
    return await this.emailService.sendResetPasswordEmail(
      user.email,
      rawToken,
      origin,
    );
  }

  async resetPassword(email: string, token: string, newPassword: string) {
    const { hashedToken } = hashedTokenGenerator(token);

    const user = await this.authRepository.findOne({
      email,
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new HttpError(400, "Invalid or expired reset token");
    }

    const isPasswordMatchToOldOne = await bcrypt.compare(
      newPassword,
      user.password,
    );
    if (isPasswordMatchToOldOne) {
      throw new HttpError(
        400,
        "Please provide a different password, you cannot reuse the current password",
      );
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await this.authRepository.updateUser(user._id.toString(), {
      password: hashedNewPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
      tokenVersion: user.tokenVersion + 1,
    });

    return { message: "Password reset successful" };
  }
}
