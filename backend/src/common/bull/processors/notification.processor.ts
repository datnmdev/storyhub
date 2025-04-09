import { JobName, QueueName } from '@/common/constants/bull.constants';
import {
  NotificationStatus,
  NotificationType,
} from '@/common/constants/notification.constants';
import { Comment } from '@/modules/comment/entities/comment.entity';
import { DepositeTransaction } from '@/modules/deposite-transaction/entities/deposite-transaction.entity';
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
          referenceId: depositeTransaction.id,
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
          reference: depositeTransaction,
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
          referenceId: comment.id,
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
          reference: comment,
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
}
