import { Module } from '@nestjs/common';
import { GoogleStorageController } from './google-storage.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { GoogleStorageService } from './google-storage.service';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 20,
      },
    ]),
  ],
  providers: [GoogleStorageService],
  controllers: [GoogleStorageController],
  exports: [GoogleStorageService],
})
export class GoogleStorageModule {}
