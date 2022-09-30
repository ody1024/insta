import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Posts } from './Posts';

@Entity()
export class Images extends BaseEntity {
  @Column()
  src: string;

  @Column()
  PostId: number;

  @ManyToOne(() => Posts, (posts) => posts.Image)
  @JoinColumn({ name: 'PostId', referencedColumnName: 'id' })
  Post: Posts;
}
