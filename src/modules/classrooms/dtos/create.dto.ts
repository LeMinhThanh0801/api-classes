import { IsNotEmpty } from "class-validator";
export default class CreateDto {
  constructor(
    name: string,
    description: string,
  ) {
    this.name = name;
    this.description = description;
  }

  @IsNotEmpty()
  public name: string;
  @IsNotEmpty()
  public description: string;
}
