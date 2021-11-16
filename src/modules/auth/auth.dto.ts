import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
class LoginDto {
  constructor(
    account_name: string,
    password: string,
  ) {
    this.account_name = account_name;
    this.password = password;
  }

  @IsNotEmpty()
  public account_name: string;
  @IsNotEmpty()
  @MinLength(6)
  public password: string;
}

class LoginGoogleDto {
  constructor(
    email: string,
    first_name: string,
    last_name: string,
    user_type: number, //0hs, 1gv
    reg_type: number, //0bthg, 1gg
  ) {
    this.email = email;
    this.first_name = first_name;
    this.last_name = last_name;
    this.user_type = user_type;
    this.reg_type = reg_type;
  }

  @IsNotEmpty()
  public email: string;
  public first_name: string;
  public last_name: string;
  public user_type: number;
  public reg_type: number;
}

export {LoginDto, LoginGoogleDto}