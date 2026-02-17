import { LoginDto, RegisterDto } from "./types/auth.types";
import { IUser } from "./types/auth.types";
import { IUserResponse } from "./dto/user-response.dto";

export abstract class AuthRepository {
  abstract createUser(
    registerDto: RegisterDto,
  ): Omit<IUser, "password"> | Promise<IUserResponse>;
  abstract findByEmail(email: string): Promise<IUser | null>;
  abstract findById(id: string): Promise<IUser | null>;
}
