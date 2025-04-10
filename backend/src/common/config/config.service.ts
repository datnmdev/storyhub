import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigModule } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly nestConfigService: NestConfigModule) {}

  getJwtConfig() {
    return {
      accessTokenConfig: {
        secret: this.nestConfigService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: Number(
          this.nestConfigService.get('JWT_ACCESS_TOKEN_EXPIRE')
        ),
      },
      refreshTokenConfig: {
        secret: this.nestConfigService.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: Number(
          this.nestConfigService.get('JWT_REFRESH_TOKEN_EXPIRE')
        ),
      },
    };
  }

  getDatabaseConfig() {
    return {
      type: 'mysql',
      host: this.nestConfigService.get('DB_HOST'),
      port: Number(this.nestConfigService.get('DB_PORT')),
      username: this.nestConfigService.get('DB_USER'),
      password: this.nestConfigService.get('DB_PASS'),
      database: this.nestConfigService.get('DB_NAME'),
      entities: ['dist/**/entities/*.{ts,js}'],
      synchronize: false,
    };
  }

  getRedisConfig() {
    return {
      host: this.nestConfigService.get('REDIS_HOST'),
      port: Number(this.nestConfigService.get('REDIS_PORT')),
      password: this.nestConfigService.get('REDIS_PASSWORD'),
    };
  }

  getMailerConfig() {
    return {
      host: this.nestConfigService.get('MAILER_HOST'),
      port: Number(this.nestConfigService.get('MAILER_PORT')),
      user: this.nestConfigService.get('MAILER_USER'),
      password: this.nestConfigService.get('MAILER_PASS'),
    };
  }

  getVnpConfig() {
    return {
      vnpTmnCode: this.nestConfigService.get('VNP_TMN_CODE'),
      vnpHashSecret: this.nestConfigService.get('VNP_HASH_SECRET'),
      vnpUrl: this.nestConfigService.get('VNP_URL'),
      vnpApi: this.nestConfigService.get('VNP_API'),
      vnpReturnUrl: this.nestConfigService.get('VNP_RETURN_URL'),
    };
  }

  getUrlCipherConfig() {
    return {
      urlCipherSecret: this.nestConfigService.get('URL_CIPHER_SECRET'),
    };
  }

  getGoogleConfig() {
    return {
      clientId: this.nestConfigService.get('GOOGLE_CLIENT_ID'),
      clientSecret: this.nestConfigService.get('GOOGLE_CLIENT_SECRET'),
      callbackUrl: this.nestConfigService.get('GOOGLE_REDIRECT_URI'),
      authUrl: this.nestConfigService.get('GOOGLE_AUTH_URL'),
      tokenUrl: this.nestConfigService.get('GOOGLE_TOKEN_URL'),
      userInfoUrl: this.nestConfigService.get('GOOGLE_USER_INFO_URL'),
    };
  }

  getFacebookConfig() {
    return {
      clientId: this.nestConfigService.get('FACEBOOK_CLIENT_ID'),
      clientSecret: this.nestConfigService.get('FACEBOOK_CLIENT_SECRET'),
      callbackUrl: this.nestConfigService.get('FACEBOOK_REDIRECT_URI'),
      authUrl: this.nestConfigService.get('FACEBOOK_AUTH_URL'),
      tokenUrl: this.nestConfigService.get('FACEBOOK_TOKEN_URL'),
      userInfoUrl: this.nestConfigService.get('FACEBOOK_USER_INFO_URL'),
    };
  }

  getGoogleStorageConfig() {
    return {
      bucketName: 'mangatoon-423713.appspot.com',
      serviceAccountKeyPath: this.nestConfigService.get(
        'SERVICE_ACCOUNT_KEY_PATH'
      ),
    };
  }

  getAwsS3Config() {
    return {
      accessKeyId: this.nestConfigService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.nestConfigService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.nestConfigService.get('AWS_REGION'),
      bucketName: this.nestConfigService.get('AWS_S3_BUCKET_NAME'),
    };
  }
}
