import { Injectable } from '@nestjs/common';
import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import * as path from 'path';
import { ConfigService } from '../config/config.service';

@Injectable()
export class GoogleStorageService {
  private storage: Storage;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.storage = new Storage({
      keyFilename: path.join(
        process.cwd(),
        'src/common/google-storage',
        'service-account.key.json'
      ),
    });
    this.bucketName = this.configService.getGoogleStorageConfig().bucketName;
  }

  async generateUploadUrl(fileKey: string, fileType: string): Promise<string> {
    const file = this.storage.bucket(this.bucketName).file(fileKey);
    const options: GetSignedUrlConfig = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000,
      contentType: fileType,
    };
    const [url] = await file.getSignedUrl(options);
    return url;
  }

  async generateSignedUrl(fileKey: string) {
    const file = this.storage.bucket(this.bucketName).file(fileKey);
    const options: GetSignedUrlConfig = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + 10 * 60 * 1000,
    };

    const [url] = await file.getSignedUrl(options);
    return url;
  }
}
