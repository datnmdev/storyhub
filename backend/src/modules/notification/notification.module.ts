import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositeTransaction } from '../deposite-transaction/entities/deposite-transaction.entity';
import { NotificationPublisher } from './notification.publisher';
import { Notification } from './entities/notification.entity';
import { NotificationUser } from './entities/notification-user.entity';
import { NotificationController } from './notification.controller';
import { ModerationRequest } from '../moderation-request/entities/moderation-request';
import { Comment } from '../comment/entities/comment.entity';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DepositeTransaction,
      Notification,
      NotificationUser,
      ModerationRequest,
      Comment,
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationPublisher, NotificationService],
  exports: [NotificationPublisher],
})
export class NotificationModule {}
