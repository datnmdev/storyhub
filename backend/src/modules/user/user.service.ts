import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailPasswordCredentialDto } from './dto/email-password-credential.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@/common/jwt/jwt.service';
import { plainToInstance } from 'class-transformer';
import { JwtPayload, Token } from '@/common/jwt/jwt.type';
import { REDIS_CLIENT } from '@/common/redis/redis.constants';
import { RedisClient } from '@/common/redis/redis.type';
import KeyGenerator from '@/common/utils/generate-key.util';
import { FailedSignInException } from '@/common/exceptions/failed-login.exception';
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

  async refreshToken(oldToken: Token) {
    try {
      const refreshTokenPayload = this.jwtService.verify(
        oldToken.refreshToken,
        this.configService.getJwtConfig().refreshTokenConfig.secret
      );
      const accessTokenPayload = this.jwtService.decode(oldToken.accessToken);
      const isTokenBlacklisted = await this.redisClient.get(
        KeyGenerator.tokenBlacklistKey(refreshTokenPayload.jti)
      );
      if (!isTokenBlacklisted) {
        const newToken = this.jwtService.generateToken({
          id: refreshTokenPayload.id,
          role: refreshTokenPayload.role,
          status: refreshTokenPayload.status,
        });
        // Đưa token cũ vào blacklist
        await this.redisClient
          .multi()
          .setEx(
            KeyGenerator.tokenBlacklistKey(accessTokenPayload.jti),
            accessTokenPayload.exp - Math.ceil(Date.now() / 1000),
            '1'
          )
          .setEx(
            KeyGenerator.tokenBlacklistKey(refreshTokenPayload.jti),
            refreshTokenPayload.exp - Math.ceil(Date.now() / 1000),
            '1'
          )
          .exec();
        return newToken;
      }
      throw new UnauthorizedException();
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async signOut(token: Token) {
    try {
      const accessTokenPayload = this.jwtService.decode(token.accessToken);
      const refreshTokenPayload = this.jwtService.decode(
        token.refreshToken
      );
      await this.redisClient
        .multi()
        .setEx(
          KeyGenerator.tokenBlacklistKey(accessTokenPayload.jti),
          accessTokenPayload.exp - Math.ceil(Date.now() / 1000),
          '1'
        )
        .setEx(
          KeyGenerator.tokenBlacklistKey(refreshTokenPayload.jti),
          refreshTokenPayload.exp - Math.ceil(Date.now() / 1000),
          '1'
        )
        .exec();
      return true;
    } catch (error) {
      console.log(error);
      
      return false;
    }
  }
}
