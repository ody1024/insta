import {
  Controller,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Patch,
  Get,
} from '@nestjs/common';
import path from 'path';
import fs from 'fs';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { User } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entity/Users';
import { PostsService } from './posts.service';
import multer from 'multer';
import { Content } from './decorators/content.decorator';

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

@UseGuards(LoggedInGuard)
@Controller('api/posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get('myInfo')
  async getMyPost(@User() user: Users) {
    return this.postsService.getMyPost(user.id);
  }

  @Get()
  async getPost(@User() user: Users) {
    return this.postsService.getPost(user.id);
  }

  @UseInterceptors(
    FilesInterceptor('image', 10, {
      storage: multer.diskStorage({
        destination(req, file, cb) {
          cb(null, 'uploads/');
        },
        filename(req, file, cb) {
          const ext = path.extname(file.originalname);
          cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @Post()
  async addPost(
    @UploadedFiles() images: Express.Multer.File[],
    @Content() content: string,
    @User() user: Users,
  ) {
    return this.postsService.addPost(images, content, user.id);
  }

  @Patch(':postId')
  async updatePost(
    @Param('postId', ParseIntPipe) postId: number,
    @User() user: Users,
    @Content() content: string,
  ) {
    return this.postsService.updatePost(postId, content, user.id);
  }

  @Delete(':postId')
  async deletePost(
    @Param('postId', ParseIntPipe) postId: number,
    @User() user: Users,
  ) {
    return this.postsService.deletePost(postId, user.id);
  }

  @Post(':postId/comment')
  async addComment(
    @Param('postId', ParseIntPipe) postId: number,
    @User() user: Users,
    @Content() content: string,
  ) {
    return this.postsService.addComment(postId, user.id, content);
  }

  @Patch(':postId/comment/:commentId')
  async updateComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @User() user: Users,
    @Content() content,
  ) {
    return this.postsService.updateComment(postId, user.id, commentId, content);
  }

  @Delete(':postId/comment/:commentId')
  async deleteComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @User() user: Users,
  ) {
    return this.postsService.deleteComment(postId, user.id, commentId);
  }

  @Post(':postId/like')
  async likeOrUnlike(
    @Param('postId', ParseIntPipe) postId: number,
    @User() user: Users,
  ) {
    return this.postsService.likeOrUnlike(postId, user.id);
  }
}
