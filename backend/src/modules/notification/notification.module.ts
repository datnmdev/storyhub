import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositeTransaction } from '../deposite-transaction/entities/deposite-transaction.entity';
import { NotificationPublisher } from './notification.publisher';

@Module({
  imports: [TypeOrmModule.forFeature([DepositeTransaction])],
  providers: [NotificationPublisher],
  exports: [NotificationPublisher],
})
export class NotificationModule {}
