import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Users } from './Users';

@Entity()
export class Follow extends BaseEntity {
  @Column()
  followerId: number;

  @Column()
  followingId: number;

  @ManyToOne(() => Users, (users) => users.Follower)
  @JoinColumn({ name: 'followerId', referencedColumnName: 'id' })
  followerUser: Users;

  @ManyToOne(() => Users, (users) => users.Following)
  @JoinColumn({ name: 'followingId', referencedColumnName: 'id' })
  followingUser: Users;
}
