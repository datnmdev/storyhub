import { Module } from '@nestjs/common';
import { ModerationRequestController } from './moderation-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModerationRequest } from './entities/moderation-request';
import { ModerationRequestService } from './moderation-request.service';
import { UrlCipherModule } from '@/common/url-cipher/url-cipher.module';
import { BullModule } from '@/common/bull/bull.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ModerationRequest]),
    UrlCipherModule,
    BullModule,
  ],
  controllers: [ModerationRequestController],
  providers: [ModerationRequestService],
})
export class ModerationRequestModule {}
