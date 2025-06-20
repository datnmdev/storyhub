import {
  ForbiddenException,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { REDIS_CLIENT } from '../redis/redis.constants';
import { RedisClient } from '../redis/redis.type';
import KeyGenerator from '../utils/generate-key.util';
import { JwtService } from '../jwt/jwt.service';
import { UnauthorizedException } from '../exceptions/unauthorized.exception';
import { ConfigService } from '../config/config.service';
import { Role, UserStatus } from '../constants/user.constants';
import { UrlCipherService } from '../url-cipher/url-cipher.service';
import { EncryptedUrl } from '../url-cipher/url-cipher.class';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: RedisClient,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authorization = req.headers['authorization'];
      if (authorization?.startsWith('Bearer ')) {
        const accessToken = authorization.split('Bearer ')[1];
        const payload = this.jwtService.decode(accessToken);
        if (payload.role === Role.GUEST) {
          req.user = payload;
          return next();
        } else {
          this.jwtService.verify(
            accessToken,
            this.configService.getJwtConfig().accessTokenConfig.secret
          );
          const isTokenBlacklisted = await this.redisClient.get(
            KeyGenerator.tokenBlacklistKey(payload.jti)
          );
          if (!isTokenBlacklisted) {
            if (payload.status === UserStatus.ACTIVATED) {
              req.user = payload;
              return next();
            }
          }
        }
      }
      return next(new UnauthorizedException());
    } catch (error) {
      return next(new UnauthorizedException());
    }
  }
}

@Injectable()
export class VerifyUrlValidityMiddleware implements NestMiddleware {
  constructor(private readonly urlCipherService: UrlCipherService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const encryptedUrl: EncryptedUrl = plainToInstance(EncryptedUrl, req.query);
    if (this.urlCipherService.verify(encryptedUrl)) {
      return next();
    }
    return next(new ForbiddenException());
  }
}
