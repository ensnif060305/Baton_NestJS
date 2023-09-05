import { IsString } from "class-validator";

export class PlaylistDto { 
  @IsString()
  playlistName: string;
}