import { LoginDto, RegisterDto } from "../document/types/auth.types";
import { IUser } from "../document/types/auth.types";
import { IUserResponse } from "../document/dto/user-response.dto";

export abstract class AuthRepository {
  abstract createUser(
    registerDto: RegisterDto,
  ): Omit<IUser, "password"> | Promise<IUserResponse>;
  abstract findByEmail(email: string): Promise<IUser | null>;
  abstract findById(id: string): Promise<IUser | null>;
  abstract updateUser(
    id: string,
    updateData: Partial<unknown>,
  ): Promise<IUser | null>;
  abstract findOne(filter: any): Promise<IUser | null>;
  abstract findMany(filter: any): Promise<IUser[]>;
  abstract totalUsers(): Promise<number>;
}
