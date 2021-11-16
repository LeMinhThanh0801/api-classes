import { IUser, TokenData } from '@modules/auth';
import { NextFunction, Request, Response } from 'express';
import RegisterDto from './dtos/register.dto';
import UserService from './users.service';
import BodyRespone from '@core/response_default';
import UpdateDto from './dtos/update.dto';

export default class UserController {
  private userService = new UserService();

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model: RegisterDto = req.body;
      const tokenData: TokenData = await this.userService.createUser(model);
      const resp = new BodyRespone('Success', tokenData);
      res.status(201).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.params.id;
      const user: IUser = await this.userService.getUserById(userId);

      const resp = new BodyRespone('Success', user);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const model: UpdateDto = req.body;
      const user: IUser = await this.userService.updateUser(userId, model);

      const resp = new BodyRespone('Success', user);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public mappingMSSVWithAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const mssv = req.body.mssv;
      const user: IUser = await this.userService.mappingMSSVWithAccount(
        mssv,
        userId
      );

      const resp = new BodyRespone('Success', user);
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };
}
