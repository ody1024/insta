import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entity/Users';
import { Posts } from 'src/entity/Posts';
import { Images } from 'src/entity/Images';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Posts, Images])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
