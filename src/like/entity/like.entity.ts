import {Column ,Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AuthEntity } from 'src/auth/entity/auth.entity';
import { MusicEntity } from 'src/music/entity/music.entity';

@Entity()
export class LiketEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AuthEntity, user => user.playlists)
  user: AuthEntity;

  @OneToMany(() => MusicEntity, music => music.playlist)
  musics: MusicEntity[];
}
