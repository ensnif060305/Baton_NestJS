import { InjectRepository } from "@nestjs/typeorm";
import { PlaylistEntity } from "./entity/playlist.entity";
import { Repository } from "typeorm";
import { AuthService } from "src/auth/auth.service";
import { TokenDto } from "src/auth/dto/token.dto";
import { UnauthorizedException, UseFilters } from "@nestjs/common";
import { HttpExceptionFilter } from "src/http.exception.fiter/http.exception.filter";
import { Injectable } from "@nestjs/common";
import { PlaylistDto } from "./dto/playlist.dto";
import { AuthEntity } from "src/auth/entity/auth.entity";

@UseFilters(new HttpExceptionFilter())
@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(PlaylistEntity) private readonly playlistEntity: Repository<PlaylistEntity>,
    @InjectRepository(AuthEntity) private readonly authEntity: Repository<AuthEntity>,
    private authService: AuthService
  ) {
    this.authService = authService
  }
  

  async getPlaylistsByUserID(token: TokenDto): Promise<object> {
    const { userID } = await this.authService.validateAccess(token)
    return this.playlistEntity.find({ where: { user: { userID } }, relations: ['musics'] });
  }

  async getMusicIDsByPlaylistID(playlistID: number): Promise<object> {
    const playlists = await this.playlistEntity.find({
      where: { id: playlistID },
      relations: ['musics'],
    });
    if (playlists.length > 0) {
      const playlist = playlists[0];
      return playlist.musics.map((music) => music.musicID);
    }
    return [];
  }

  async addPlaylist(token:TokenDto, playlistName:PlaylistDto): Promise<object> {
    const { userID } = await this.authService.validateAccess(token)
    const user = await this.authEntity.findOne({
      where: {
        userID
      }
    });
    
    if (!user) {
      throw new Error('User not found');
    }

    const playlist = new PlaylistEntity();
    playlist.playlistName = playlistName.playlistName;
    playlist.user = user;

    return this.playlistEntity.save(playlist);
  }
}