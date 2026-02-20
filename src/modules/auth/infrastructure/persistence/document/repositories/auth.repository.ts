import { RegisterDto } from "../types/auth.types";
import { IUserResponse } from "../dto/user-response.dto";
import { User } from "../schemas/user.schema";
import { AuthRepository } from "../auth.repository";
import { IUser } from "../types/auth.types";

export class AuthDocumentRepository extends AuthRepository {
  constructor() {
    super();
  }

  async createUser(registerDto: RegisterDto): Promise<IUser> {
    return await User.create(registerDto);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).select("+password");
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id).select("+password");
  }

  async updateUser(
    id: string,
    updateData: Partial<IUser>,
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async findOne(filter: any): Promise<IUser | null> {
    return await User.findOne(filter).select(
      "+password +passwordResetToken +passwordResetExpires +tokenVersion",
    );
  }
}
