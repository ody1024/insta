import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entity/Users';
import { Posts } from 'src/entity/Posts';
import { Images } from 'src/entity/Images';
import { Hashtag } from 'src/entity/Hashtag';
import { HashtagPost } from 'src/entity/HashtagPost';
import { Comments } from 'src/entity/Comments';
import { Liked } from 'src/entity/Liked';
import { Follow } from 'src/entity/Follow';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Posts,
      Images,
      Hashtag,
      HashtagPost,
      Comments,
      Liked,
      Follow,
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
