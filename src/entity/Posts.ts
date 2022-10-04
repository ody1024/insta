import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Comments } from './Comments';
import { HashtagPost } from './HashtagPost';
import { Images } from './Images';
import { Liked } from './Liked';
import { Users } from './Users';

@Entity()
export class Posts extends BaseEntity {
  @Column('text')
  content: string;

  @Column('int')
  UserId: number;

  @OneToMany(() => Comments, (comments) => comments.Post)
  Comments: Comments[];

  @OneToMany(() => Liked, (liked) => liked.Post)
  Liked: Liked[];

  @OneToMany(() => HashtagPost, (hashtagPost) => hashtagPost.Post)
  HashtagPost: HashtagPost[];

  @OneToMany(() => Images, (images) => images.Post)
  Image: Images[];

  @ManyToOne(() => Users, (users) => users.Post, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'UserId', referencedColumnName: 'id' })
  User: Users;
}
