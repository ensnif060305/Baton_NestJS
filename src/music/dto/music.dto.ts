import { IsString } from 'class-validator';

export class MusicDto {
  @IsString()
  musicname: string;

  @IsString()
  musicimg: string;

  @IsString()
  musicAuthor: string;

  @IsString()
  date: string;
}
