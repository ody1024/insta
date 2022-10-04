import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from 'src/entity/Comments';
import { Follow } from 'src/entity/Follow';
import { Hashtag } from 'src/entity/Hashtag';
import { HashtagPost } from 'src/entity/HashtagPost';
import { Images } from 'src/entity/Images';
import { Liked } from 'src/entity/Liked';
import { Posts } from 'src/entity/Posts';
import { Repository, DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Posts) private postsRepository: Repository<Posts>,
    @InjectRepository(HashtagPost)
    private hashtagPostRepository: Repository<HashtagPost>,
    @InjectRepository(Hashtag)
    private hashtagRepository: Repository<Hashtag>,
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
    @InjectRepository(Liked)
    private likedRepository: Repository<Liked>,
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
  ) {}

  async getMyPost(userId: number) {
    const result = await this.postsRepository
      .createQueryBuilder('posts')
      .where('posts.UserId = :userId', { userId })
      .orderBy('posts.createdAt', 'DESC')
      .getMany();
    return result;
  }

  async getPost(userId: number) {
    const following = await this.followRepository.find({
      where: { followerId: userId },
    });

    const ids = following.map((v) => v.followingId);
    ids.push(userId);
    const result = await this.postsRepository
      .createQueryBuilder('posts')
      .where('posts.UserId In (:...ids)', { ids })
      .skip(0)
      .take(10)
      .orderBy('posts.createdAt', 'DESC')
      .getMany();
    return result;
  }

  async addPost(
    images: Express.Multer.File[],
    content: string,
    userId: number,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const postEn = new Posts();
      postEn.content = content;
      postEn.UserId = userId;
      const savedPost = await queryRunner.manager
        .getRepository(Posts)
        .save(postEn);

      await this.registerHashtag(content, queryRunner, savedPost);

      if (images) {
        for (const image of images) {
          const imageEn = new Images();
          imageEn.src = image.path;
          imageEn.PostId = savedPost.id;
          await queryRunner.manager.getRepository(Images).save(imageEn);
        }
      }
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updatePost(postId: number, content: string, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const post = await this.postsRepository.findOneByOrFail({
        id: postId,
        UserId: userId,
      });
      post.content = content;
      await queryRunner.manager.getRepository(Posts).save(post);

      const existHashtagPosts = await queryRunner.manager
        .getRepository(HashtagPost)
        .find({
          where: { PostId: post.id },
        });

      if (existHashtagPosts) {
        for (const existHashtagPost of existHashtagPosts) {
          await queryRunner.manager
            .getRepository(HashtagPost)
            .remove(existHashtagPost);
        }
      }
      await this.registerHashtag(content, queryRunner, post);
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deletePost(postId: number, userId: number) {
    try {
      const post = await this.postsRepository.findOneByOrFail({
        id: postId,
        UserId: userId,
      });
      await this.postsRepository.remove(post);
      return true;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('존재하지 않는 게시물입니다.');
    }
  }

  async addComment(postId: number, userId: number, content: string) {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) throw new BadRequestException('게시물이 없습니다.');
    const commentEn = new Comments();
    commentEn.PostId = post.id;
    commentEn.UserId = userId;
    commentEn.content = content;
    await this.commentsRepository.save(commentEn);
    return true;
  }

  async updateComment(
    postId: number,
    userId: number,
    commentId: number,
    content: string,
  ) {
    const comment = await this.getComment(commentId, userId, postId);
    comment.content = content;
    await this.commentsRepository.save(comment);
    return true;
  }

  async deleteComment(postId: number, userId: number, commentId: number) {
    const comment = await this.getComment(commentId, userId, postId);
    await this.commentsRepository.remove(comment);
    return true;
  }

  async likeOrUnlike(postId: number, userId: number) {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) throw new BadRequestException('없는 게시물입니다.');
    const liked = await this.likedRepository.findOne({
      where: { PostId: postId, UserId: userId },
    });
    if (liked) {
      await this.likedRepository.remove(liked);
      return true;
    } else {
      const likedEn = new Liked();
      likedEn.PostId = post.id;
      likedEn.UserId = userId;
      await this.likedRepository.save(likedEn);
      return true;
    }
  }

  async getComment(id: number, UserId: number, PostId: number) {
    const comment = await this.commentsRepository.findOne({
      where: { id, UserId, PostId },
    });
    if (!comment) throw new BadRequestException('없는 댓글입니다.');
    return comment;
  }

  async registerHashtag(
    content: string,
    queryRunner: QueryRunner,
    post: Posts,
  ) {
    const hashtags = content.match(/#[^\s#]+/g);
    if (hashtags) {
      for (const hashtag of hashtags) {
        const existHashtag = await queryRunner.manager
          .getRepository(Hashtag)
          .findOne({ where: { name: hashtag } });
        if (!existHashtag) {
          const hashtagEn = new Hashtag();
          hashtagEn.name = hashtag;

          const savedHashtag = await queryRunner.manager
            .getRepository(Hashtag)
            .save(hashtagEn);

          const hashtagPostEn = new HashtagPost();
          hashtagPostEn.HashtagId = savedHashtag.id;
          hashtagPostEn.PostId = post.id;
          await queryRunner.manager
            .getRepository(HashtagPost)
            .save(hashtagPostEn);
        } else {
          const hashtagPostEn = new HashtagPost();
          hashtagPostEn.HashtagId = existHashtag.id;
          hashtagPostEn.PostId = post.id;
          await queryRunner.manager
            .getRepository(HashtagPost)
            .save(hashtagPostEn);
        }
      }
    }
  }
}
