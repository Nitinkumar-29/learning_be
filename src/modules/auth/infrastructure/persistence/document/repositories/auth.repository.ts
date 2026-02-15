import { LoginDto, RegisterDto } from "../types/auth.types";
import { User } from "../schemas/user.schema";
import { AuthRepository } from "../auth.repository";
import { IUser } from "../interfaces/user.interface";

export class AuthDocumentRepository extends AuthRepository {
  constructor() {
    super();
  }
  async login(loginDto: LoginDto): Promise<unknown> {
    try {
      console.log("Login method called", loginDto);
      const user = await User.findOne({ email: loginDto.email });
      if (!user) {
        throw new Error("User not found");
      }
      const isPasswordValid = user.password === loginDto.password;
      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }
      return user;
    } catch (error) {
      throw error;
    }
  }


  async register(registerDto: RegisterDto): Promise<unknown> {
    try {
      const user = await User.create({
        email: registerDto.email,
        password: registerDto.password,
        mobileNumber: registerDto.mobileNumber,
        role: registerDto.role || "user",
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string): Promise<IUser | null> {
    try {
      console.log("findByEmail called with email:", email);
      const user = await User.findOne({ email });
      console.log("findByEmail result:", user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<unknown> {
    try {
      const user = await User.findById(id);
      return user;
    } catch (error) {
      throw error;
    }
  }
}
