import { Body, Controller, Get, Post } from "@nestjs/common";
import { MusicService } from "./music.service";
import { TokenDto } from "src/auth/dto/token.dto";
import { MusicDto } from "./dto/music.dto";

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}
  
  @Get('/getAll')
  async getAll(): Promise<object> {
    const data = await this.musicService.getAll();

    return Object.assign({
      data,
      statusCode: 200,
      statusMsg: 'test'
    });
  }

  @Post('/addmMusic')
  async addMusic(@Body() music: MusicDto): Promise<object> {
    const data = await this.musicService.addMusic(music)

    return({
      data,
      statusCode: 204,
      statusMsg: 'testadd'
    });
  }
}