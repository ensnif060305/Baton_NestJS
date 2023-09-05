import { IsString } from "class-validator";

export class UserDto {
  @IsString()
  username: string;

  @IsString()
  nickname: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}
