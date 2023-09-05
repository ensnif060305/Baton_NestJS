import { PlaylistEntity } from 'src/playlist/entity/playlist.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


@Entity()
export class AuthEntity {
  @PrimaryGeneratedColumn({
    type: 'integer',
  })
  userID: number;

  @OneToMany(() => PlaylistEntity, playlist => playlist.user)
  playlists: PlaylistEntity[];

  @Column({
    type: 'varchar',
  })
  username: string;

  @Column({
    type: 'varchar',
    unique:true
  })
  nickname: string;

  @Column({
    type: 'varchar',
    unique:true
  })
  email: string;

  @Column({
    type: 'varchar',
  })
  password: string;
}
