import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AwsS3Service } from './aws-s3.service';
import { AwsS3Controller } from './aws-s3.controller';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 20,
      },
    ]),
  ],
  providers: [AwsS3Service],
  controllers: [AwsS3Controller],
  exports: [AwsS3Service],
})
export class AwsS3Module {}
