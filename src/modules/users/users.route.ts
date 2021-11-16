import { Route } from "@core/interfaces";
import { authMiddleware } from "@core/middleware";
import validationMiddleware from "@core/middleware/validation.middleware";
import { Router } from "express";
import RegisterDto from "./dtos/register.dto";
import UpdateDto from "./dtos/update.dto";
import UsersController from "./users.controller";

export default class UsersRoute implements Route {
  public path = "/api/users";
  public router = Router();

  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(RegisterDto, true),
      this.usersController.register
    );

    this.router.put(
      `${this.path}/update`,
      validationMiddleware(UpdateDto, true),
      authMiddleware,
      this.usersController.updateUser
    );

    this.router.get(
      `${this.path}/get/:id`,
      this.usersController.getUserById
    );

    this.router.post(
      `${this.path}/mapping_mssv`,
      authMiddleware,
      this.usersController.mappingMSSVWithAccount
    );
  }
}
