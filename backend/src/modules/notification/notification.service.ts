import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Brackets, DataSource, Repository } from 'typeorm';
import { NotificationUser } from './entities/notification-user.entity';
import { GetNotificationWithFilterDto } from './dtos/get-notification-with-filter.dto';
import { NotificationType } from '@/common/constants/notification.constants';
import { DepositeTransaction } from '../deposite-transaction/entities/deposite-transaction.entity';
import { ModerationRequest } from '../moderation-request/entities/moderation-request';
import { Comment } from '../comment/entities/comment.entity';
import * as _ from 'lodash';
import UrlResolverUtils from '@/common/utils/url-resolver.util';
import { UrlCipherService } from '@/common/url-cipher/url-cipher.service';
import { UpdateNotificationDto } from './dtos/update-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(NotificationUser)
    private readonly notificationUserRepository: Repository<NotificationUser>,
    private readonly urlCipherService: UrlCipherService,
    private readonly dataSource: DataSource
  ) {}

  async getNotificationWithFilter(
    receiverId: number,
    getNotificationWithFilterDto: GetNotificationWithFilterDto
  ) {
    const qb = this.notificationUserRepository
      .createQueryBuilder('notificationUser')
      .innerJoinAndSelect('notificationUser.notification', 'notification')
      .leftJoinAndSelect(
        'notification.depositeTransaction',
        'depositeTransaction'
      )
      .leftJoinAndSelect('notification.comment', 'comment')
      .leftJoinAndSelect('comment.story', 'story')
      .leftJoinAndSelect('comment.chapter', 'chapter')
      .leftJoinAndSelect('chapter.chapterTranslations', 'chapterTranslations')
      .leftJoinAndSelect('chapter.story', 'story1')
      .leftJoinAndSelect('story1.author', 'author')
      .leftJoinAndSelect('author.userProfile', 'userProfile1')
      .leftJoinAndSelect('comment.reader', 'reader')
      .leftJoinAndSelect('reader.userProfile', 'userProfile')
      .leftJoinAndSelect('comment.parent', 'parent')
      .leftJoinAndSelect('notification.moderationRequest', 'moderationRequest')
      .leftJoinAndSelect(
        'moderationRequest.chapter',
        'moderationRequestChapter'
      )
      .leftJoinAndSelect(
        'moderationRequestChapter.story',
        'moderationRequestChapterStory'
      )
      .leftJoinAndSelect(
        'moderationRequestChapter.chapterTranslations',
        'chapterTranslations1'
      )
      .leftJoinAndSelect('moderationRequestChapterStory.author', 'author1')
      .leftJoinAndSelect('author1.userProfile', 'userProfile2')
      .where('notificationUser.receiver_id = :receiverId', {
        receiverId,
      })
      .andWhere(
        new Brackets((qb) => {
          if (getNotificationWithFilterDto.notificationId) {
            qb.where('notificationUser.notification_id = :notificationId', {
              notificationId: getNotificationWithFilterDto.notificationId,
            });
          }
        })
      )
      .andWhere(
        new Brackets((qb) => {
          if (getNotificationWithFilterDto.status) {
            getNotificationWithFilterDto.status.forEach((status, index) => {
              qb.orWhere(`notificationUser.status = :status${index}`, {
                [`status${index}`]: status,
              });
            });
          }
        })
      );

    if (getNotificationWithFilterDto.orderBy) {
      getNotificationWithFilterDto.orderBy.forEach((value) => {
        qb.addOrderBy(`notificationUser.${value[0]}`, value[1]);
      });
    }
    qb.take(getNotificationWithFilterDto.limit);
    qb.skip(
      (getNotificationWithFilterDto.page - 1) *
        getNotificationWithFilterDto.limit
    );
    const notificationUsers = await qb.getManyAndCount();

    return [
      notificationUsers[0].map((notificationUser) => {
        return {
          ...notificationUser,
          notification: {
            ...notificationUser.notification,
            comment: {
              ...notificationUser.notification.comment,
              reader: {
                ..._.omit(notificationUser.notification.comment?.reader, [
                  'password',
                ]),
                userProfile: {
                  ...notificationUser.notification.comment?.reader.userProfile,
                  avatar: notificationUser?.notification?.comment?.reader
                    ?.userProfile?.avatar
                    ? UrlResolverUtils.createUrl(
                        '/url-resolver',
                        this.urlCipherService.generate({
                          url: notificationUser.notification.comment.reader
                            .userProfile.avatar,
                          expireIn: 30 * 60 * 60,
                          iat: Date.now(),
                        })
                      )
                    : notificationUser?.notification?.comment?.reader
                        ?.userProfile?.avatar,
                },
              },
            },
          },
        };
      }),
      notificationUsers[1],
    ];
  }

  updateNotification(
    userId: number,
    updateNotificationDto: UpdateNotificationDto
  ) {
    return this.notificationUserRepository.update(
      {
        notificationId: updateNotificationDto.notificationId,
        receiverId: userId,
      },
      {
        status: updateNotificationDto.status,
      }
    );
  }

  async deleteNotificationById(userId: number, notificationId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const notificationUser = await queryRunner.manager.findOne(
        NotificationUser,
        {
          where: {
            receiverId: userId,
            notificationId,
          },
          relations: ['notification'],
        }
      );
      if (
        notificationUser.notification.type ===
          NotificationType.DEPOSITE_NOTIFICATION ||
        notificationUser.notification.type ===
          NotificationType.COMMENT_NOTIFICATION
      ) {
        await queryRunner.manager.delete(Notification, {
          id: notificationUser.notificationId,
        });
      } else if (
        notificationUser.notification.type ===
        NotificationType.STORY_NOTIFICATION
      ) {
        await queryRunner.manager.delete(NotificationUser, {
          receiverId: notificationUser.receiverId,
          notificationId: notificationUser.notificationId,
        });
      }
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteAllNotification(userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const notificationUsers = await queryRunner.manager.find(
        NotificationUser,
        {
          where: {
            receiverId: userId,
          },
          relations: ['notification'],
        }
      );
      for (const notificationUser of notificationUsers) {
        if (
          notificationUser.notification.type ===
            NotificationType.DEPOSITE_NOTIFICATION ||
          notificationUser.notification.type ===
            NotificationType.COMMENT_NOTIFICATION
        ) {
          await queryRunner.manager.delete(Notification, {
            id: notificationUser.notificationId,
          });
        } else if (
          notificationUser.notification.type ===
          NotificationType.STORY_NOTIFICATION
        ) {
          await queryRunner.manager.delete(NotificationUser, {
            receiverId: notificationUser.receiverId,
            notificationId: notificationUser.notificationId,
          });
        }
      }
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
