import { Injectable, UseFilters } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HttpExceptionFilter } from "src/http.exception.fiter/http.exception.filter";
import { MusicEntity } from "./entity/music.entity";
import { Repository } from "typeorm";
import { MusicDto } from "./dto/music.dto";

@UseFilters(new HttpExceptionFilter())
@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(MusicEntity) private musicEntity: Repository<MusicEntity>
  ) {}

  async getAll(): Promise<object> {
    return await this.musicEntity.find();
  }

  async getPlayListMusic(musicID: number): Promise<object> {
    return await this.musicEntity.findOne({
      where: {
        musicID
      }
    })
  }

  async addMusic(music: MusicDto): Promise<object> {
    const {musicname, musicimg, musicAuthor, date } = music

   const newMusic = await this.musicEntity.save({
      musicname,
      musicimg,
      musicAuthor,
      date,
    });

    return newMusic
  }
}