import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import { Comments } from 'src/entity/Comments';
import { Follow } from 'src/entity/Follow';
import { Hashtag } from 'src/entity/Hashtag';
import { HashtagPost } from 'src/entity/HashtagPost';
import { Images } from 'src/entity/Images';
import { Liked } from 'src/entity/Liked';
import { Posts } from 'src/entity/Posts';
import { Users } from 'src/entity/Users';

dotenv.config();
const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    Users,
    Hashtag,
    Comments,
    Follow,
    HashtagPost,
    Images,
    Posts,
    Liked,
  ],
  autoLoadEntities: true,
  charset: 'utf8mb4',
  synchronize: false,
  logging: true,
};

export = config;
