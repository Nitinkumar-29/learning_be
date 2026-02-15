import { error } from "console";
import { loginDto, registerDto } from "../../../../dto/auth.dto";
import { User } from "../../../../schemas/user.schema";
import { AuthRepository } from "../auth.repository";

export class AuthDocumentRepository extends AuthRepository {
  constructor() {
    super();
  }
  async login(loginDto: loginDto): Promise<unknown> {
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

  async register(registerDto: registerDto): Promise<unknown> {
    try {
      const user = await User.create({
        email: registerDto.email,
        password: registerDto.password,
        mobileNumber: registerDto.mobileNumber,
        role: registerDto.role || "user",
      });
      console.log("User created:", user);
      return user;
    } catch (error) {
      throw error;
    }
  }
}
