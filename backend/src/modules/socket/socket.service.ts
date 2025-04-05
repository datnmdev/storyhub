import { ConfigService } from '@/common/config/config.service';
import { Role, UserStatus } from '@/common/constants/user.constants';
import { JwtService } from '@/common/jwt/jwt.service';
import { REDIS_CLIENT } from '@/common/redis/redis.constants';
import { RedisClient } from '@/common/redis/redis.type';
import KeyGenerator from '@/common/utils/generate-key.util';
import { Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(REDIS_CLIENT)
    private readonly redisClient: RedisClient
  ) {}

  async auth(client: Socket) {
    const accessToken = client.handshake.auth.token;
    try {
      const payload = this.jwtService.decode(accessToken);
      if (payload.role != Role.GUEST) {
        this.jwtService.verify(
          accessToken,
          this.configService.getJwtConfig().accessTokenConfig.secret
        );
        const isTokenBlacklisted = await this.redisClient.get(
          KeyGenerator.tokenBlacklistKey(payload.jti)
        );

        if (!isTokenBlacklisted) {
          if (payload.status === UserStatus.ACTIVATED) {
            client.user = payload;
            return true;
          }
        }
      }
    } catch (error) {
      return false;
    }
    return false;
  }
}
