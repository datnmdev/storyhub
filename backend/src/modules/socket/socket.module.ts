import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { NotificationPublisher } from '../notification/notification.publisher';
import { Module } from '@nestjs/common';
import { NotificationModule } from '../notification/notification.module';
import { ConcreteNotificationSubscriber } from '../notification/notification.subscriber';
import { SocketService } from './socket.service';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: process.env.FRONTEND_HOST,
  },
})
@Module({
  imports: [NotificationModule],
  providers: [SocketService],
  exports: [SocketService],
})
export class SocketModule implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly notificationPublisher: NotificationPublisher,
    private readonly socketService: SocketService
  ) {}

  async handleConnection(client: Socket) {
    const isAuthenticated = await this.socketService.auth(client);
    if (isAuthenticated) {
      this.notificationPublisher.subscribe(
        new ConcreteNotificationSubscriber(client)
      );
    }
    console.log('connect:::', this.notificationPublisher.getSubscribers().map((subscriber: ConcreteNotificationSubscriber) => subscriber.getClient().user));
  }

  handleDisconnect(client: Socket) {
    this.notificationPublisher.unsubscribe(
      this.notificationPublisher
        .getSubscribers()
        .find(
          (subscriber: ConcreteNotificationSubscriber) =>
            subscriber.getClient() === client
        )
    );
    console.log('disconnect:::', this.notificationPublisher.getSubscribers().map((subscriber: ConcreteNotificationSubscriber) => subscriber.getClient().user));
  }
}
