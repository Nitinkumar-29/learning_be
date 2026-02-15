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

  async login(loginDto: LoginDto) {
    const user = await this.authRepository.findByEmail(loginDto.email);
    console.log("User found:", user);
    if (!user) {
      throw new HttpError(400, "Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpError(401, "Invalid email or password");
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return {
      id: user._id,
      email: user.email,
      role: user.role,
      token,
    };
  }

  async registerUser(registerDto: RegisterDto) {
    try {
      const hashPassword = bcrypt.hash(registerDto.password, 10);
      const result = await this.authRepository.register({
        ...registerDto,
        password: hashPassword,
      });
      console.log("Hashed Password:", hashPassword);
      return result;
    } catch (error: any) {
      throw error;
    }
  }
}
