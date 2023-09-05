import { Module } from '@nestjs/common';
import { MusicController } from './music.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicService } from './music.service';
import { MusicEntity } from './entity/music.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MusicEntity])],
  providers: [MusicService],
  controllers: [MusicController],
})
export class MusicModule {}
