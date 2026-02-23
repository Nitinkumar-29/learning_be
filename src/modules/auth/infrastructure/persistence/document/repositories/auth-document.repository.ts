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

  async findMany(filter: any): Promise<IUser[]> {
    const page = Math.max(1, Number(filter?.page) || 1);
    const limit = Math.max(1, Number(filter?.limit) || 10);
    const skip = (page - 1) * limit;

    const filterQueryBuilder: any = {};

    // optional exact filters
    if (filter?.role) filterQueryBuilder.role = filter.role;
    if (typeof filter?.isActive === "boolean") {
      filterQueryBuilder.isActive = filter.isActive;
    }

    // text search
    if (filter?.search?.trim()) {
      const search = filter.search.trim();
      const re = new RegExp(search, "i"); // case-insensitive

      filterQueryBuilder.$or = [
        { name: re },
        { companyName: re },
        { email: re },
        { mobileNumber: re },
      ];
    }

    return await User.find(filterQueryBuilder)
      .skip(skip)
      .limit(limit)
      .select(
        "-password -passwordResetToken -passwordResetExpires -tokenVersion",
      )
      .lean();
  }

  async totalUsers(): Promise<number> {
    return await User.countDocuments();
  }
}
