import { LoginDto, RegisterDto } from "./types/auth.types";
import { IUser } from "./interfaces/user.interface";

export abstract class AuthRepository {
  abstract login(loginDto: LoginDto): Promise<unknown>;
  abstract register(registerDto: RegisterDto): Promise<unknown>;
  abstract findByEmail(email: string): Promise<IUser | null>;
  abstract findById(id: string): Promise<unknown>;
}
