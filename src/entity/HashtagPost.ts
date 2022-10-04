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

  @ManyToOne(() => Hashtag, (hashtag) => hashtag.HashtagPost, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'HashtagId', referencedColumnName: 'id' })
  Hashtag: Hashtag;

  @ManyToOne(() => Posts, (posts) => posts.HashtagPost, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'PostId', referencedColumnName: 'id' })
  Post: Posts;
}
