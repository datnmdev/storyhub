import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailPasswordCredentialDto } from './dto/email-password-credential.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@/common/jwt/jwt.service';
import { plainToInstance } from 'class-transformer';
import { JwtPayload } from '@/common/jwt/jwt.type';
import { REDIS_CLIENT } from '@/common/redis/redis.constants';
import { RedisClient } from '@/common/redis/redis.type';
import KeyGenerator from '@/common/utils/generate-key.util';
import { FailedSignInException } from '@/common/exceptions/failed-login.exception';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UnauthorizedException } from '@/common/exceptions/unauthorized.exception';
import { User } from './entities/user.entity';
import { ConfigService } from '@/common/config/config.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject(REDIS_CLIENT)
    private readonly redisClient: RedisClient,
    private readonly configService: ConfigService
  ) {}

  async loginWithEmailPassword(
    emailPasswordCredentialDto: EmailPasswordCredentialDto
  ) {
    // Kiểm tra tài khoản của địa chỉ email được yêu cầu đến có tồn tại hay không?
    const user = await this.userRepository.findOne({
      where: {
        email: emailPasswordCredentialDto.email,
      },
    });
    if (user) {
      // Kiểm tra mật khẩu có khớp hay không?
      const checkPassword = await bcrypt.compare(
        emailPasswordCredentialDto.password,
        user.password
      );
      if (checkPassword) {
        const payload = plainToInstance(JwtPayload, {
          id: user.id,
          role: user.role,
          status: user.status,
        });
        return this.jwtService.generateToken(payload);
      }
    }

    throw new FailedSignInException();
  }

  async validateToken(authorization: string) {
    try {
      if (authorization) {
        if (authorization.startsWith('Bearer')) {
          const split = authorization.split(' ');
          if (split.length == 2) {
            const jwtPayload = this.jwtService.verify(
              split[1],
              this.configService.getJwtConfig().accessTokenConfig.secret
            );
            const isTokenBlacklisted = await this.redisClient.get(
              KeyGenerator.tokenBlacklistKey(jwtPayload.jti)
            );
            if (!isTokenBlacklisted) {
              return true;
            }
          }
        }
      }

      throw new UnauthorizedException();
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const jwtPayload = this.jwtService.verify(
        refreshTokenDto.refreshToken,
        this.configService.getJwtConfig().refreshTokenConfig.secret
      );
      const isTokenBlacklisted = await this.redisClient.get(
        KeyGenerator.tokenBlacklistKey(jwtPayload.jti)
      );
      if (!isTokenBlacklisted) {
        const newToken = this.jwtService.generateToken({
          id: jwtPayload.id,
          role: jwtPayload.role,
          status: jwtPayload.status,
        });
        // Đưa refresh token cũ vào blacklist
        await this.redisClient.setEx(
          KeyGenerator.tokenBlacklistKey(jwtPayload.jti),
          jwtPayload.exp - Math.ceil(Date.now() / 1000),
          '1'
        );
        return newToken;
      }

      throw new UnauthorizedException();
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
