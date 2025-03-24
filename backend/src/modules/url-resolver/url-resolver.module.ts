import { Module } from '@nestjs/common';
import { UrlResolverController } from './url-resolver.controller';
import { GoogleStorageModule } from '@/common/google-storage/google-storage.module';
import { UrlResolverService } from './url-resolver.service';

@Module({
  imports: [GoogleStorageModule],
  controllers: [UrlResolverController],
  providers: [UrlResolverService],
  exports: [UrlResolverService],
})
export class UrlResolverModule {}
