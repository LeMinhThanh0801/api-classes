import UserSchema from "./users.model";
import RegisterDto from "./dtos/register.dto";
import { DataStoredInToken, TokenData } from "@modules/auth";
import { isEmptyObject } from "@core/utils";
import { HttpException } from "@core/exception";
import gravatar from "gravatar";
import bcryptjs from "bcryptjs";
import IUser from "./users.interface";
import UpdateDto from "./dtos/update.dto";
import { generateJwtToken, randomTokenString } from "@core/utils/helpers";
import { RefreshTokenSchema } from "@modules/refresh_token";

class UserService {
  public userSchema = UserSchema;

  public async createUser(model: RegisterDto): Promise<TokenData> {
    if (isEmptyObject(model) === true) {
      throw new HttpException(400, "Model is empty");
    }

    const user = await this.userSchema
      .findOne({ account_name: model.account_name })
      .exec();
    if (user) {
      throw new HttpException(
        409,
        `Your account_name ${model.account_name} already exist`
      );
    }

    const avatar = gravatar.url(model.email!, {
      size: "200",
      rating: "g",
      default: "mm",
    });

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(model.password!, salt);
    
    const createdUser: IUser = await this.userSchema.create({
      ...model,
      reg_type: 0,
      password: hashedPassword,
      avatar: avatar,
      create_at: Date.now(),
    });
    const refreshToken = await this.generateRefreshToken(createdUser._id);
    await refreshToken.save();

    return generateJwtToken(createdUser._id, refreshToken.token);
  }

  public async updateUser(userId: string, model: UpdateDto): Promise<IUser> {
    if (isEmptyObject(model) === true) {
      throw new HttpException(400, "Model is empty");
    }

    const user = await this.userSchema.findById(userId).exec();
    if (!user) {
      throw new HttpException(400, `User is not exists`);
    }

    let updateUserById;

    if (model.password) {
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(model.password, salt);
      updateUserById = await this.userSchema
        .findByIdAndUpdate(userId, {
          ...model,
          update_at: new Date(),
          password: hashedPassword,
        })
        .exec();
    } else {
      updateUserById = await this.userSchema
        .findByIdAndUpdate(userId, {
          ...model,
          update_at: new Date(),
        })
        .exec();
    }

    if (!updateUserById) {
      throw new HttpException(409, "You are not an user");
    }

    const user_updated = await this.userSchema.findById(userId).exec();
    if (!user_updated) {
      throw new HttpException(404, `User is not exists`);
    }

    return user_updated;
  }

  public async getUserById(userId: string): Promise<IUser> {
    const user = await this.userSchema.findById(userId).exec();
    if (!user) {
      throw new HttpException(404, `User is not exists`);
    }
    return user;
  }

  public async mappingMSSVWithAccount(
    mssv: string,
    userId: string
  ): Promise<IUser> {
    const user = await this.userSchema.findById(userId).exec();
    if (!user) {
      throw new HttpException(404, `User is not exists`);
    }

    if (user.user_type === 1) {
      throw new HttpException(400, `User is teacher`);
    }

    const updateUserById = await this.userSchema
      .findByIdAndUpdate(userId, {
        mssv: mssv,
      })
      .exec();

    if (!updateUserById) {
      throw new HttpException(409, "Error when mapping");
    }

    const user_updated = await this.userSchema.findById(userId).exec();
    if (!user_updated) {
      throw new HttpException(404, `User is not exists`);
    }

    return user_updated;
  }

  private async generateRefreshToken(userId: string) {
    // create a refresh token that expires in 7 days
    return new RefreshTokenSchema({
      user: userId,
      token: randomTokenString(),
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  }
}

export default UserService;
