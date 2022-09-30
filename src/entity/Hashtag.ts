import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { HashtagPost } from './HashtagPost';

@Entity()
export class Hashtag extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => HashtagPost, (hashtagPost) => hashtagPost.Hashtag)
  HashtagPost: HashtagPost[];
}
