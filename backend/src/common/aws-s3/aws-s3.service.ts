import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class AwsS3Service {
  private s3: S3Client;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.getAwsS3Config().region,
      credentials: {
        accessKeyId: this.configService.getAwsS3Config().accessKeyId,
        secretAccessKey: this.configService.getAwsS3Config().secretAccessKey,
      },
    });

    this.bucketName = this.configService.getAwsS3Config().bucketName;
  }

  async generateUploadUrl(fileKey: string, fileType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      ContentType: fileType,
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: 15 * 60 });
    return url;
  }

  async generateSignedUrl(fileKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: 10 * 60 });
    return url;
  }
}
