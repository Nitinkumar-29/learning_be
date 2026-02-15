import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { loginDto, registerDto } from "./dto/auth.dto";

export class AuthController {
  constructor(private authService: AuthService) {
    this.authService = authService;
    this.login = this.login.bind(this);
    this.registerUser = this.registerUser.bind(this);
  }

  async login(req: any, res: any, next: any) {
    try {
      console.log("Login request received", req.body);
      const loginPayload = <loginDto>req.body;

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
      const ReqBody = req.body as registerDto;
      console.log("Request Body:", ReqBody);
      const result = await this.authService.registerUser(ReqBody);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
