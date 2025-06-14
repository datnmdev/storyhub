import { Module } from '@nestjs/common';
import { UrlResolverController } from './url-resolver.controller';
import { GoogleStorageModule } from '@/common/google-storage/google-storage.module';
import { UrlResolverService } from './url-resolver.service';
import { AwsS3Module } from '@/common/aws-s3/aws-s3.module';

@Module({
  imports: [GoogleStorageModule, AwsS3Module],
  controllers: [UrlResolverController],
  providers: [UrlResolverService],
  exports: [UrlResolverService],
})
export class UrlResolverModule {}
