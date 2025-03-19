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
    _BullModule.registerQueue({
      name: QueueName.MAIL,
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    BullBoardModule.forFeature({
      name: QueueName.MAIL,
      adapter: BullAdapter,
    }),
    MailModule,
    RedisModule,
  ],
  providers: [BullService, MailProcessor],
  exports: [BullService],
})
export class BullModule {}
