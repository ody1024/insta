import {
  Controller,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Param,
} from '@nestjs/common';
import path from 'path';
import fs from 'fs';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { User } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entity/Users';

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

@UseGuards(LoggedInGuard)
@Controller('api/posts')
export class PostsController {
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async addPost(
    @UploadedFile() file: Express.Multer.File,
    @Body('content') content: string,
    @User() user: Users,
  ) {
    console.log(file);
    console.log(content);
    return true;
  }
}
