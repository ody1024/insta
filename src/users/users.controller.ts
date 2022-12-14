import {
  Controller,
  UseGuards,
  Post,
  Body,
  ForbiddenException,
  Response,
  Param,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { NotLoggedInGuard } from 'src/auth/not-logged-in.guard';
import { User } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entity/Users';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User() user: Users) {
    return user;
  }

  @UseGuards(NotLoggedInGuard)
  @Post()
  async join(@Body() data: JoinRequestDto) {
    const result = await this.usersService.join(
      data.email,
      data.nickname,
      data.password,
    );
    if (result) {
      return 'ok';
    } else {
      throw new ForbiddenException();
    }
  }

  @UseGuards(LoggedInGuard)
  @Post('logout')
  async logout(@Response() res) {
    res.clearCookie('connect.sid', { httpOnly: true });
    return res.send('ok');
  }

  @UseGuards(LoggedInGuard)
  @Post(':followingId/follow')
  async follow(
    @Param('followingId', ParseIntPipe) followingId: number,
    @User() user: Users,
  ) {
    return this.usersService.follow(user.id, followingId);
  }

  @UseGuards(LoggedInGuard)
  @Get('following')
  async getFollowing(@User() user: Users) {
    const result = await this.usersService.getFollowing(user.id);
    return result ? result : 0;
  }

  @UseGuards(LoggedInGuard)
  @Get('follower')
  async getFollower(@User() user: Users) {
    const result = await this.usersService.getFollower(user.id);
    return result ? result : 0;
  }
}
