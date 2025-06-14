import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
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
import { AliasModule } from './modules/alias/alias.module';
import { GenreModule } from './modules/genre/genre.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { HistoryModule } from './modules/history/history.module';
import { CommentModule } from './modules/comment/comment.module';
import { CommentInteractionModule } from './modules/comment-interaction/comment-interaction.module';
import { SocketModule } from './modules/socket/socket.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ModerationRequestModule } from './modules/moderation-request/moderation-request.module';
import { BackgroundModule } from './modules/background/background.module';

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
    AliasModule,
    GenreModule,
    InvoiceModule,
    HistoryModule,
    CommentModule,
    CommentInteractionModule,
    SocketModule,
    NotificationModule,
    ModerationRequestModule,
    BackgroundModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthorizationMiddleware)
      .forRoutes(
        'auth/sign-out',
        'user-profile/get-profile',
        {
          path: 'user-profile',
          method: RequestMethod.PUT,
        },
        'wallet',
        'deposite-transaction/create-payment-url',
        'deposite-transaction/get-deposite-transaction-history',
        'google-storage',
        'aws-s3',
        {
          path: 'rating',
          method: RequestMethod.POST,
        },
        {
          path: 'rating',
          method: RequestMethod.PUT,
        },
        {
          path: 'rating',
          method: RequestMethod.GET,
        },
        {
          path: 'follow',
          method: RequestMethod.POST,
        },
        {
          path: 'follow',
          method: RequestMethod.DELETE,
        },
        {
          path: 'follow',
          method: RequestMethod.GET,
        },
        {
          path: 'invoice',
          method: RequestMethod.GET,
        },
        'chapter/reader/content',
        'chapter/with-invoice-relation',
        {
          path: 'invoice',
          method: RequestMethod.POST,
        },
        {
          path: 'follow/filter',
          method: RequestMethod.GET,
        },
        {
          path: 'follow/all',
          method: RequestMethod.DELETE,
        },
        'auth/verify-change-password-info',
        'auth/change-password',
        'history',
        {
          path: 'comment',
          method: RequestMethod.POST,
        },
        {
          path: 'comment',
          method: RequestMethod.PUT,
        },
        {
          path: 'comment/:id',
          method: RequestMethod.DELETE,
        },
        'comment-interaction',
        'notification',
        {
          path: '/story/author/filter',
          method: RequestMethod.GET,
        },
        {
          path: '/story/author/soft-delete/:id',
          method: RequestMethod.PUT,
        },
        {
          path: '/story',
          method: RequestMethod.POST,
        },
        {
          path: '/story/:storyId',
          method: RequestMethod.PUT,
        },
        {
          path: '/alias',
          method: RequestMethod.PUT,
        },
        {
          path: '/story/:storyId/genre-detail',
          method: RequestMethod.PUT,
        },
        {
          path: '/price',
          method: RequestMethod.POST,
        },
        '/chapter/author/filter',
        {
          path: '/chapter/author/soft-delete/:id',
          method: RequestMethod.PUT,
        },
        {
          path: '/chapter',
          method: RequestMethod.POST,
        },
        {
          path: '/chapter/:chapterId',
          method: RequestMethod.PUT,
        },
        'moderation-request'
      )
      .apply(VerifyUrlValidityMiddleware)
      .forRoutes('url-resolver');
  }
}
