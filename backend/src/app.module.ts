import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from './common/jwt/jwt.module';
import { RedisModule } from './common/redis/redis.module';
import { MiddlewareModule } from './common/middleware/middleware.module';
import {
  AuthorizationMiddleware,
  VerifyUrlValidityMiddleware,
} from './common/middleware/middleware.service';
import { UserProfileModule } from './modules/user-profile/user-profile.module';
import { ConfigModule } from './common/config/config.module';
import { ConfigService } from './common/config/config.service';
import { MailModule } from './common/mail/mail.module';
import { BullModule } from './common/bull/bull.module';
import { CountryModule } from './modules/country/country.module';
import { GuardModule } from './common/guards/guard.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { DepositeTransactionModule } from './modules/deposite-transaction/deposite-transaction.module';
import { ChapterModule } from './modules/chapter/chapter.module';
import { UrlCipherModule } from './common/url-cipher/url-cipher.module';
import { FollowModule } from './modules/follow/follow.module';
import { PriceModule } from './modules/price/price.module';
import { RatingModule } from './modules/rating/rating.module';
import { StoryModule } from './modules/story/story.module';
import { GoogleStorageModule } from './common/google-storage/google-storage.module';
import { UrlResolverModule } from './modules/url-resolver/url-resolver.module';
import { ViewModule } from './modules/view/view.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getDatabaseConfig().host,
        port: Number(configService.getDatabaseConfig().port),
        username: configService.getDatabaseConfig().username,
        password: configService.getDatabaseConfig().password,
        database: configService.getDatabaseConfig().database,
        entities: configService.getDatabaseConfig().entities,
        synchronize: configService.getDatabaseConfig().synchronize,
      }),
      inject: [ConfigService],
    }),
    RedisModule.forRoot({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    }),
    JwtModule,
    MiddlewareModule,
    BullModule,
    MailModule,
    GuardModule,
    UserModule,
    UserProfileModule,
    CountryModule,
    WalletModule,
    DepositeTransactionModule,
    ChapterModule,
    UrlCipherModule,
    GoogleStorageModule,
    UrlResolverModule,
    StoryModule,
    ViewModule,
    FollowModule,
    PriceModule,
    RatingModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthorizationMiddleware)
      .forRoutes(
        'auth/sign-out',
        'user-profile',
        'wallet',
        'deposite-transaction/create-payment-url',
        'deposite-transaction/get-deposite-transaction-history'
      )
      .apply(VerifyUrlValidityMiddleware)
      .forRoutes('url-resolver');
  }
}
