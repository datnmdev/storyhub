import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositeTransaction } from '../deposite-transaction/entities/deposite-transaction.entity';
import { NotificationPublisher } from './notification.publisher';
import { Notification } from './entities/notification.entity';
import { NotificationUser } from './entities/notification-user.entity';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notification,
      NotificationUser,
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationPublisher, NotificationService],
  exports: [NotificationPublisher],
})
export class NotificationModule {}
