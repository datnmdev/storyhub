import { BullModule as _BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { QueueName } from '../constants/bull.constants';
import { MailModule } from '../mail/mail.module';
import { BullService } from './bull.service';
import { MailProcessor } from './processors/mail.processor';
import { ConfigService } from '../config/config.service';
import { ExpressAdapter } from '@bull-board/express';
import { NotificationModule } from '@/modules/notification/notification.module';
import { NotificationProcessor } from './processors/notification.processor';

@Module({
  imports: [
    _BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.getRedisConfig().host,
          port: configService.getRedisConfig().port,
          password: configService.getRedisConfig().password,
        },
        prefix: 'bull:',
      }),
      inject: [ConfigService],
    }),
    _BullModule.registerQueue(
      {
        name: QueueName.MAIL,
      },
      {
        name: QueueName.NOTIFICATION,
      }
    ),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    BullBoardModule.forFeature(
      {
        name: QueueName.MAIL,
        adapter: BullAdapter,
      },
      {
        name: QueueName.NOTIFICATION,
        adapter: BullAdapter,
      }
    ),
    MailModule,
    RedisModule,
    NotificationModule,
  ],
  providers: [BullService, MailProcessor, NotificationProcessor],
  exports: [BullService],
})
export class BullModule {}
