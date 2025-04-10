import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Equal, Repository } from 'typeorm';
import { CommentType } from '@/common/constants/comment.constants';
import { Comment } from './entities/comment.entity';
import UrlResolverUtils from '@/common/utils/url-resolver.util';
import { UrlCipherService } from '@/common/url-cipher/url-cipher.service';
import { plainToInstance } from 'class-transformer';
import { UrlCipherPayload } from '@/common/url-cipher/url-cipher.class';
import { GetCommentWithFilterDto } from './dtos/get-comment-with-filter.dto';
import { CreateCommentDto } from './dtos/create-comment.dto';
import * as _ from 'lodash';
import { BullService } from '@/common/bull/bull.service';
import { JobName } from '@/common/constants/bull.constants';
import { Notification } from '../notification/entities/notification.entity';
import { NotificationType } from '@/common/constants/notification.constants';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly urlCipherService: UrlCipherService,
    private readonly bullService: BullService,
    private readonly dataSource: DataSource
  ) {}

  async getCommentWithFilter(getCommentWithFilterDto: GetCommentWithFilterDto) {
    const qb = this.commentRepository
      .createQueryBuilder('comment')
      .innerJoinAndSelect('comment.reader', 'reader')
      .innerJoinAndSelect('reader.userProfile', 'userProfile')
      .where(
        new Brackets((qb) => {
          if (getCommentWithFilterDto.id) {
            qb.where('comment.id = :id', {
              id: getCommentWithFilterDto.id,
            });
          }
        })
      )
      .andWhere(
        new Brackets((qb) => {
          if (getCommentWithFilterDto.type) {
            qb.where('comment.type = :type', {
              type: getCommentWithFilterDto.type,
            });
          }
        })
      )
      .andWhere(
        new Brackets((qb) => {
          if (getCommentWithFilterDto.parentId > 0) {
            qb.where('comment.parentId = :parentId', {
              parentId: getCommentWithFilterDto.parentId,
            });
          } else {
            qb.where('comment.parentId IS NULL');
          }
        })
      )
      .andWhere(
        new Brackets((qb) => {
          if (
            getCommentWithFilterDto.type === CommentType.STORY_COMMENT &&
            getCommentWithFilterDto.storyId
          ) {
            qb.where('comment.storyId = :storyId', {
              storyId: getCommentWithFilterDto.storyId,
            });
          }
        })
      )
      .andWhere(
        new Brackets((qb) => {
          if (
            getCommentWithFilterDto.type === CommentType.CHAPTER_COMMENT &&
            getCommentWithFilterDto.chapterId
          ) {
            qb.where('comment.chapterId = :chapterId', {
              chapterId: getCommentWithFilterDto.chapterId,
            });
          }
        })
      )
      .andWhere(
        new Brackets((qb) => {
          if (getCommentWithFilterDto.readerId) {
            qb.where('comment.readerId = :readerId', {
              readerId: getCommentWithFilterDto.readerId,
            });
          }
        })
      );

    if (getCommentWithFilterDto.orderBy) {
      getCommentWithFilterDto.orderBy.forEach((value) => {
        qb.addOrderBy(`comment.${value[0]}`, value[1]);
      });
    }
    qb.take(getCommentWithFilterDto.limit);
    qb.skip((getCommentWithFilterDto.page - 1) * getCommentWithFilterDto.limit);
    const result = await qb.getManyAndCount();
    return [
      result[0].map((comment) => {
        return {
          ...comment,
          reader: {
            ..._.omit(comment.reader, 'password'),
            userProfile: {
              ...comment.reader.userProfile,
              avatar: UrlResolverUtils.createUrl(
                '/url-resolver',
                this.urlCipherService.generate(
                  plainToInstance(UrlCipherPayload, {
                    url: comment.reader.userProfile.avatar,
                  } as UrlCipherPayload)
                )
              ),
            },
          },
        };
      }),
      result[1],
    ];
  }

  async createComment(userId: number, createCommentDto: CreateCommentDto) {
    const commentEnitiy = this.commentRepository.create({
      type: createCommentDto.type,
      content: createCommentDto.content,
      parentId: createCommentDto.parentId,
      chapterId:
        createCommentDto.type === CommentType.CHAPTER_COMMENT
          ? createCommentDto.chapterId
          : null,
      storyId:
        createCommentDto.type === CommentType.STORY_COMMENT
          ? createCommentDto.storyId
          : null,
      readerId: userId,
    });
    const newComment = await this.commentRepository.save(commentEnitiy);

    if (typeof newComment.parentId === 'number') {
      const parent = await this.commentRepository.findOne({
        where: {
          id: newComment.parentId,
        },
      });
      if (parent.readerId != userId) {
        const responseComment = await this.commentRepository.findOne({
          where: {
            id: newComment.id,
          },
          relations: [
            'story',
            'chapter',
            'chapter.chapterTranslations',
            'chapter.story',
            'reader',
            'reader.userProfile',
            'parent',
          ],
        });
        await this.bullService.addNotificationJob(
          JobName.SEND_COMMENT_NOTIFICATION,
          {
            ...responseComment,
            reader: {
              ..._.omit(responseComment.reader, ['password']),
              userProfile: {
                ...responseComment.reader.userProfile,
                avatar: responseComment.reader.userProfile.avatar
                  ? UrlResolverUtils.createUrl(
                      '/url-resolver',
                      this.urlCipherService.generate({
                        url: responseComment.reader.userProfile.avatar,
                        expireIn: 30 * 60 * 60,
                        iat: Date.now(),
                      })
                    )
                  : responseComment.reader.userProfile.avatar,
              },
            },
          }
        );
      }
    }

    return newComment;
  }

  updateComment(id: number, content: string) {
    return this.commentRepository.update(id, {
      content,
      updatedAt: new Date(),
    });
  }

  deleteComment(id: number) {
    return this.commentRepository.delete(id);
  }
}
