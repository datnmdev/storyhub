import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { REDIS_CLIENT } from '../redis/redis.constants';
import { RedisClient } from '../redis/redis.type';
import KeyGenerator from '../utils/generate-key.util';
import { JwtService } from '../jwt/jwt.service';
import { UnauthorizedException } from '../exceptions/unauthorized.exception';
import { ConfigService } from '../config/config.service';
import { UserStatus } from '../constants/user.constants';

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
        const jwtPayload = this.jwtService.verify(
          accessToken,
          this.configService.getJwtConfig().accessTokenConfig.secret
        );
        const isTokenBlacklisted = await this.redisClient.get(
          KeyGenerator.tokenBlacklistKey(jwtPayload.jti)
        );
        if (!isTokenBlacklisted) {
          if (jwtPayload.status === UserStatus.ACTIVATED) {
            req.user = jwtPayload;
            return next();
          }
        }
      }
      return next(new UnauthorizedException());
    } catch (error) {
      return next(new UnauthorizedException());
    }
  }
}
