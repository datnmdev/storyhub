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
import { ClientManagerService, SocketService } from './socket.service';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: process.env.FRONTEND_HOST,
  },
})
@Module({
  imports: [NotificationModule],
  providers: [SocketService, ClientManagerService],
  exports: [SocketService, ClientManagerService],
})
export class SocketModule implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly notificationPublisher: NotificationPublisher,
    private readonly socketService: SocketService,
    private readonly clientManagerService: ClientManagerService
  ) {}

  async handleConnection(client: Socket) {
    const isAuthenticated = await this.socketService.auth(client);
    if (isAuthenticated) {
      this.clientManagerService.add(client);
      this.notificationPublisher.subscribe(
        new ConcreteNotificationSubscriber(client)
      );
    }
  }

  handleDisconnect(client: Socket) {
    this.clientManagerService.remove(client);
    this.notificationPublisher.unsubscribe(
      this.notificationPublisher
        .getSubscribers()
        .find(
          (subscriber: ConcreteNotificationSubscriber) =>
            subscriber.getClient() === client
        )
    );
  }
}
