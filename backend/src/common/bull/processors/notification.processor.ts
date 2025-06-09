import { JobName, QueueName } from '@/common/constants/bull.constants';
import { ModerationRequestStatus } from '@/common/constants/moderation-request.constants';
import {
  NotificationStatus,
  NotificationType,
} from '@/common/constants/notification.constants';
import { Comment } from '@/modules/comment/entities/comment.entity';
import { DepositeTransaction } from '@/modules/deposite-transaction/entities/deposite-transaction.entity';
import { ModerationRequest } from '@/modules/moderation-request/entities/moderation-request';
import { NotificationUser } from '@/modules/notification/entities/notification-user.entity';
import { Notification } from '@/modules/notification/entities/notification.entity';
import { NotificationPublisher } from '@/modules/notification/notification.publisher';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { DataSource } from 'typeorm';

@Processor(QueueName.NOTIFICATION)
export class NotificationProcessor {
  constructor(
    private readonly dataSource: DataSource,
    private readonly notificationPublisher: NotificationPublisher
  ) {}

  @Process(JobName.SEND_DEPOSITE_TRANSACTION_NOTIFICATION)
  async sendDepositeTransactionNotification(job: Job) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const depositeTransaction: DepositeTransaction = job.data;
      const notificationEntity: Notification = queryRunner.manager.create(
        Notification,
        {
          type: NotificationType.DEPOSITE_NOTIFICATION,
          depositeTransactionId: depositeTransaction.id,
        }
      );
      const newNotification =
        await queryRunner.manager.save(notificationEntity);
      const notificationUserEntity: NotificationUser =
        queryRunner.manager.create(NotificationUser, {
          receiverId: depositeTransaction.readerId,
          notificationId: newNotification.id,
          status: NotificationStatus.SENT,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      const newNotificationUser = await queryRunner.manager.save(
        notificationUserEntity
      );
      await this.notificationPublisher.notifySubscribers({
        ...newNotificationUser,
        notification: {
          ...newNotification,
          depositeTransaction,
        },
      });
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  @Process(JobName.SEND_COMMENT_NOTIFICATION)
  async sendCommentNotification(job: Job) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const comment: Comment = job.data;
      const notificationEntity: Notification = queryRunner.manager.create(
        Notification,
        {
          type: NotificationType.COMMENT_NOTIFICATION,
          commentId: comment.id,
        }
      );
      const newNotification =
        await queryRunner.manager.save(notificationEntity);
      const notificationUserEntity: NotificationUser =
        queryRunner.manager.create(NotificationUser, {
          receiverId: comment.parent.readerId,
          notificationId: newNotification.id,
          status: NotificationStatus.SENT,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      const newNotificationUser = await queryRunner.manager.save(
        notificationUserEntity
      );
      await this.notificationPublisher.notifySubscribers({
        ...newNotificationUser,
        notification: {
          ...newNotification,
          comment,
        },
      });
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  @Process(JobName.SEND_STORY_NOTIFICATION)
  async sendModerationRequestNotification(job: Job) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const moderationRequest: ModerationRequest = job.data;
      const notificationEntity: Notification = queryRunner.manager.create(
        Notification,
        {
          type: NotificationType.STORY_NOTIFICATION,
          moderationRequestId: moderationRequest.id,
        }
      );
      const newNotification =
        await queryRunner.manager.save(notificationEntity);

      // Send users is author
      const notificationUserEntity: NotificationUser =
        queryRunner.manager.create(NotificationUser, {
          receiverId: moderationRequest.authorId,
          notificationId: newNotification.id,
          status: NotificationStatus.SENT,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      const newNotificationUser = await queryRunner.manager.save(
        notificationUserEntity
      );
      await this.notificationPublisher.notifySubscribers({
        ...newNotificationUser,
        notification: {
          ...newNotification,
          moderationRequest,
        },
      });

      // Send users following this story
      if (moderationRequest.status === ModerationRequestStatus.APPROVED) {
        const followers = moderationRequest.chapter.story.followDetails;
        for (const follower of followers) {
          const notificationUserEntity: NotificationUser =
            queryRunner.manager.create(NotificationUser, {
              receiverId: follower.readerId,
              notificationId: newNotification.id,
              status: NotificationStatus.SENT,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          const newNotificationUser = await queryRunner.manager.save(
            notificationUserEntity
          );
          await this.notificationPublisher.notifySubscribers({
            ...newNotificationUser,
            notification: {
              ...newNotification,
              moderationRequest,
            },
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
