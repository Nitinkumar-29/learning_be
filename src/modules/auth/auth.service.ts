import { HttpError } from "../../common/errors/http.error";
import { generateToken } from "../../common/utils/jwt";
import {
  LoginDto,
  RegisterDto,
} from "./infrastructure/persistence/document/types/auth.types";
import { AuthRepository } from "./infrastructure/persistence/document/auth.repository";
const bcrypt = require("bcryptjs");

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

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
    });

    return {
      userData: user,
      token,
    };
  }

  async registerUser(registerDto: RegisterDto) {
    const hashPassword = await bcrypt.hash(registerDto.password, 10);

    return this.authRepository.createUser({
      ...registerDto,
      password: hashPassword,
    });
  }
}
