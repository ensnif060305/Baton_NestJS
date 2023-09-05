import { IsString } from 'class-validator';

export class TokenDto {
  @IsString()
  accesstoken: string;
}
