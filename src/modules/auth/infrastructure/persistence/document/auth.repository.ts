import { loginDto, registerDto } from "../../../dto/auth.dto";

export abstract class AuthRepository {
  abstract login(loginDto: loginDto): Promise<unknown>;
  abstract register(registerDto: registerDto): Promise<unknown>;
}
