import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicModule } from './music/music.module';
import { PlaylistModule } from './playlist/playlist.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: 3306,
      host: 'localhost',
      username: 'root',
      password: 'jms0305!',
      database: 'baton',
      entities: [__dirname + '/**/entity/*.js'],
      synchronize: true,
      logging: false,
      migrations: [__dirname + '/**/migrations/*.js'],
      migrationsTableName: 'migrations',
      autoLoadEntities: true,
    }),
    RedisModule.forRoot({
      readyLog: true,
      config: {
        host: '127.0.0.1',
        port: 6379,
        password: '',
      },
    }),
    AuthModule,
    MusicModule,
    PlaylistModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
