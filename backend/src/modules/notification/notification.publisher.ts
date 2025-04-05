import { Injectable } from '@nestjs/common';
import { Notification } from '@/modules/notification/entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DepositeTransaction } from '@/modules/deposite-transaction/entities/deposite-transaction.entity';
import { Repository } from 'typeorm';
import {
  ConcreteNotificationSubscriber,
  NotificationSubscriber,
} from './notification.subscriber';
import { NotificationType } from '@/common/constants/notification.constants';

@Injectable()
export class NotificationPublisher {
  private subscribers: NotificationSubscriber[];

  constructor(
    @InjectRepository(DepositeTransaction)
    private depositeTransactionRepository: Repository<DepositeTransaction>
  ) {
    this.subscribers = [];
  }

  public getSubscribers() {
    return this.subscribers;
  }

  public subscribe(subscriber: NotificationSubscriber) {
    this.subscribers.push(subscriber);
  }

  public unsubscribe(subscriber: NotificationSubscriber) {
    this.subscribers = this.subscribers.filter((s) => s !== subscriber);
  }

  async notifySubscribers(data: Notification) {
    if (data.type === NotificationType.DEPOSITE_NOTIFICATION) {
      const depositeTransaction =
        await this.depositeTransactionRepository.findOne({
          where: {
            id: data.referenceId,
          },
        });

      this.subscribers
        .filter(
          (subscriber: ConcreteNotificationSubscriber) =>
            subscriber.getClient().user.id === depositeTransaction.readerId
        )
        .forEach((subscriber) => subscriber.updateNotification(data));
    }
  }
}
