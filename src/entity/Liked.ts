import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Posts } from './Posts';
import { Users } from './Users';

@Entity()
export class Liked extends BaseEntity {
  @Column()
  UserId: number;

  @Column()
  PostId: number;

  @ManyToOne(() => Users, (users) => users.Liked)
  @JoinColumn({ name: 'UserId', referencedColumnName: 'id' })
  User: Users;

  @ManyToOne(() => Posts, (posts) => posts.Liked)
  @JoinColumn({ name: 'PostId', referencedColumnName: 'id' })
  Post: Posts;
}
