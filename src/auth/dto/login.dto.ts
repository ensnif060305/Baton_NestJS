import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  readonly email: string;

  // Add password field
  @IsString()
  readonly password: string;
}
