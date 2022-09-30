import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Hashtag } from './Hashtag';
import { Posts } from './Posts';

@Entity()
export class HashtagPost extends BaseEntity {
  @Column()
  HashtagId: number;

  @Column()
  PostId: number;

  @ManyToOne(() => Hashtag, (hashtag) => hashtag.HashtagPost)
  @JoinColumn({ name: 'HashtagId', referencedColumnName: 'id' })
  Hashtag: Hashtag;

  @ManyToOne(() => Posts, (posts) => posts.HashtagPost)
  @JoinColumn({ name: 'PostId', referencedColumnName: 'id' })
  Post: Posts[];
}
