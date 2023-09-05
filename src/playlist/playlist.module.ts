import { Module } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistService } from './playlist.service';
import { PlaylistEntity } from './entity/playlist.entity';
import { AuthService } from 'src/auth/auth.service';
import { AuthEntity } from 'src/auth/entity/auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([
      PlaylistEntity,
      AuthEntity
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('SECRETORPRIVATE'),
        signOptions: {
          expiresIn: '4h'
        },
        verifyOptions: {
          complete: false,
        }
      })
    })
  ],
  providers: [PlaylistService, AuthService],
  controllers: [PlaylistController],
})
export class PlaylistModule {}
