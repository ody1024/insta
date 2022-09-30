import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Comments } from './Comments';
import { Follow } from './Follow';
import { Liked } from './Liked';

@Entity()
export class Users extends BaseEntity {
  @Column()
  nickname: string;

  @Column()
  email: string;

  @Column('text')
  password: string;

  @OneToMany(() => Comments, (comments) => comments.User)
  Comments: Comments[];

  @OneToMany(() => Liked, (liked) => liked.User)
  Liked: Liked[];

  @OneToMany(() => Follow, (follow) => follow.followerUser)
  Follower: Follow[];

  @OneToMany(() => Follow, (follow) => follow.followingUser)
  Following: Follow[];
}
