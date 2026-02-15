import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import {
  LoginDto,
  RegisterDto,
} from "./infrastructure/persistence/document/types/auth.types";

export class AuthController {
  constructor(private authService: AuthService) {
    this.authService = authService;
    this.login = this.login.bind(this);
    this.registerUser = this.registerUser.bind(this);
  }

  async login(req: any, res: any, next: any) {
    try {
      console.log("Login request received", req.body);
      const loginPayload = <LoginDto>req.body;

      const result = await this.authService.login(loginPayload);
      res.status(200).json(result);

      return result;
    } catch (error) {
      next(error);
    }
  }

  async registerUser(req: Request, res: Response, next: any) {
    try {
      console.log("Register request received", req.body);
      const ReqBody = <RegisterDto>req.body;
      console.log("Request Body:", ReqBody);
      const result = await this.authService.registerUser(ReqBody);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
