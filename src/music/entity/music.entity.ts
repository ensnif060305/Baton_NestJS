import { PlaylistEntity } from 'src/playlist/entity/playlist.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class MusicEntity {
  @PrimaryGeneratedColumn({
    type: 'integer',
  })
  musicID: number;

  @ManyToOne(() => PlaylistEntity, playlist => playlist.musics)
  playlist: PlaylistEntity;

  @Column({
    type: 'varchar',
  })
  musicname: string;

  @Column({
    type: 'varchar',
    unique:true
  })
  musicimg: string;

  @Column({
    type: 'varchar',
    unique:true
  })
  musicAuthor: string;

  @Column({
    type: 'varchar',
  })
  date: string;
}