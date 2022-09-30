import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Comments } from './Comments';
import { HashtagPost } from './HashtagPost';
import { Images } from './Images';
import { Liked } from './Liked';

@Entity()
export class Posts extends BaseEntity {
  @Column('text')
  content: string;

  @OneToMany(() => Comments, (comments) => comments.Post)
  Comments: Comments[];

  @OneToMany(() => Liked, (liked) => liked.Post)
  Liked: Liked[];

  @OneToMany(() => HashtagPost, (hashtagPost) => hashtagPost.Post)
  HashtagPost: HashtagPost[];

  @OneToMany(() => Images, (images) => images.Post)
  Image: Images[];
}
