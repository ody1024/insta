import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Posts } from './Posts';
import { Users } from './Users';

@Entity()
export class Comments extends BaseEntity {
  @Column()
  content: string;

  @Column()
  UserId: number;

  @Column()
  PostId: number;

  @ManyToOne(() => Users, (users) => users.Comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'UserId', referencedColumnName: 'id' })
  User: Users;

  @ManyToOne(() => Posts, (posts) => posts.Comments, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'PostId', referencedColumnName: 'id' })
  Post: Posts;
}
