import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Users } from './Users';

@Entity()
export class Follow extends BaseEntity {
  @Column()
  followerId: number;

  @Column()
  followingId: number;

  @ManyToOne(() => Users, (users) => users.Follower, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'followerId', referencedColumnName: 'id' })
  followerUser: Users;

  @ManyToOne(() => Users, (users) => users.Following, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'followingId', referencedColumnName: 'id' })
  followingUser: Users;
}
