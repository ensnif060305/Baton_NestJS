import { IsNumber, IsString } from 'class-validator';

export class TokenResultDto {
  @IsNumber()
  userID: number;

  @IsString()
  nickname: string;
}
