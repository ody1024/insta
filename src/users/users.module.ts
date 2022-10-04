import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entity/Users';
import { Follow } from 'src/entity/Follow';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Follow])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
