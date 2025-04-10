import { Injectable } from '@nestjs/common';
import {
  ConcreteNotificationSubscriber,
  NotificationSubscriber,
} from './notification.subscriber';
import { NotificationType } from '@/common/constants/notification.constants';

@Injectable()
export class NotificationPublisher {
  private subscribers: NotificationSubscriber[];

  constructor() {
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

  async notifySubscribers(data: any) {
    if (data.notification.type === NotificationType.DEPOSITE_NOTIFICATION) {
      this.subscribers
        .filter(
          (subscriber: ConcreteNotificationSubscriber) =>
            subscriber.getClient().user.id === data.receiverId
        )
        .forEach((subscriber) => subscriber.updateNotification(data));
    } else if (
      data.notification.type === NotificationType.COMMENT_NOTIFICATION
    ) {
      this.subscribers
        .filter(
          (subscriber: ConcreteNotificationSubscriber) =>
            subscriber.getClient().user.id === data.receiverId
        )
        .forEach((subscriber: ConcreteNotificationSubscriber) =>
          subscriber.updateNotification(data)
        );
    }
  }
}
