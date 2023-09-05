import { Body, Controller, Get, Headers, Post } from "@nestjs/common";
import { PlaylistService } from "./playlist.service";
import { TokenDto } from "src/auth/dto/token.dto";
import { PlaylistDto } from "./dto/playlist.dto";

@Controller('playlist')
export class PlaylistController {
  constructor(private playlistService: PlaylistService) {
    this.playlistService = playlistService
  }

  @Get('/')
  async getPlaylists(@Headers() tokenDto: TokenDto) {
    const data = await this.playlistService.getPlaylistsByUserID(tokenDto);
    return Object.assign({
      data,
      statusCode: 200,
      statusMsg: '조회 성공'
    })
  }

  @Post('/add')
  async addPlaylist(
    @Headers() tokenDto: TokenDto,
    @Body() playlistName: PlaylistDto): Promise<object> {
    const data = await this.playlistService.addPlaylist( tokenDto, playlistName )

    return Object.assign({
      data,
      statusCode: 201,
      statusMsg: '추가 성공'
    })
  }

  @Post('/addMusic')
  async addPlaylistMusic(@Body() id:number): Promise<object> {

    return Object.assign({
      statusbar
    })
  }
}