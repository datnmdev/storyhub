import { Notification } from '@/modules/notification/entities/notification.entity';
import { Socket } from 'socket.io';

export interface NotificationSubscriber {
  updateNotification: (data: Notification) => void;
}

export class ConcreteNotificationSubscriber implements NotificationSubscriber {
  private client: Socket;

  constructor(client: Socket) {
    this.client = client;
  }

  public getClient(): Socket {
    return this.client;
  }

  public updateNotification(data: Notification) {
    this.client.emit('notification', data);
  }
}
