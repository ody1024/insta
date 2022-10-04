import {
  ForbiddenException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import bcrypt from 'bcrypt';
import { Users } from 'src/entity/Users';
import { Follow } from 'src/entity/Follow';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(Follow) private followRepository: Repository<Follow>,
  ) {}

  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
  }

  async join(email: string, nickname: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      throw new ForbiddenException('이미 존재하는 사용자입니다');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const returned = await this.usersRepository.save({
      email,
      nickname,
      password: hashedPassword,
    });
    if (!returned) {
      throw new BadRequestException('잘못된 요청입니다.');
    }
    return true;
  }

  async follow(followerId: number, followingId: number) {
    const follow = await this.followRepository.findOne({
      where: { followerId, followingId },
    });
    if (follow) {
      await this.followRepository.remove(follow);
      return true;
    } else {
      const followEn = new Follow();
      followEn.followerId = followerId;
      followEn.followingId = followingId;
      await this.followRepository.save(followEn);
      return true;
    }
  }

  async getFollowing(userId: number) {
    const following = await this.followRepository.find({
      where: { followerId: userId },
    });
    console.log(following);
    return following.length;
  }

  async getFollower(userId: number) {
    const follower = await this.followRepository.find({
      where: { followingId: userId },
    });
    return follower.length;
  }
}
