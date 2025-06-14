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

@Injectable()
export class ClientManagerService {
  private clients: Socket[];

  constructor() {
    this.clients = [];
  }

  add(client: Socket) {
    this.clients.push(client);
  }

  remove(client: Socket) {
    const index = this.clients.findIndex((_client) => _client === client);
    if (index != -1) {
      this.clients.splice(index, 1);
    }
  }

  getAll() {
    return this.clients;
  }
}
