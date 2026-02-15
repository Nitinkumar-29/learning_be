import { loginDto, registerDto } from "./dto/auth.dto";
import { AuthRepository } from "./infrastructure/persistence/document/auth.repository";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {
    this.authRepository = authRepository;
    this.login = this.login.bind(this);
    this.registerUser = this.registerUser.bind(this);
  }

  async login(loginDto: loginDto) {
    try {
      console.log("Login method called", loginDto);
      const result = await this.authRepository.login(loginDto);
      return result;
    } catch (error: any) {
      throw error;
    }
  }

  async registerUser(registerDto: registerDto) {
    try {
      const result = await this.authRepository.register(registerDto);
      return result;
    } catch (error: any) {
      throw error;
    }
  }
}
