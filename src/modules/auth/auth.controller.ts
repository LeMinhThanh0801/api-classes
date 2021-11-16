import { IUser, TokenData } from "@modules/auth";
import { NextFunction, Request, Response } from "express";
import AuthService from "./auth.service";
import BodyRespone from "@core/response_default";
import { LoginDto, LoginGoogleDto } from "./auth.dto";

export default class AuthController {
  private authService = new AuthService();

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model: LoginDto = req.body;
      const tokenData: TokenData = await this.authService.login(model);

      const resp = new BodyRespone("Success", tokenData);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public loginGoogle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model: LoginGoogleDto = req.body;
      const tokenData: TokenData = await this.authService.loginGoogle(model);

      const resp = new BodyRespone("Success", tokenData);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.body.refreshToken;
      const tokenData: TokenData = await this.authService.refreshToken(refreshToken);

      const resp = new BodyRespone("Success", tokenData);
      res.status(200).json(tokenData);
    } catch (error) {
      next(error);
    }
  };

  public revokeToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.header("authorization");

      let notifi = await this.authService.revokeToken(token as string);
      const resp = new BodyRespone("Success", {});
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public getCurrentLoginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user: IUser = await this.authService.getCurrentLoginUser(
        req.user.id
      );

      const resp = new BodyRespone("Success", user);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  
}
