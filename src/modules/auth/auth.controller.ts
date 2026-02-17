import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  constructor(private authService: AuthService) {
    this.authService = authService;
    this.login = this.login.bind(this);
    this.registerUser = this.registerUser.bind(this);
  }

  async login(req: any, res: any, next: any) {
    try {
      const loginPayload = req.body;

      const result = await this.authService.login(loginPayload);
      const loginResponse = {
        message: "User logged in successfully",
        success: true,
        data: result,
      };
      return res.status(200).json(loginResponse);
    } catch (error) {
      next(error);
    }
  }

  async registerUser(req: Request, res: Response, next: any) {
    try {
      const ReqBody = req.body;
      const result = await this.authService.registerUser(ReqBody);

      const registerResponse = {
        message: "User registered successfully",
        success: true,
        data: result,
      };
      res.json(registerResponse);
    } catch (error) {
      next(error);
    }
  }
}
