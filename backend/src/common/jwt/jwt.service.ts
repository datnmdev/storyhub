import { Injectable } from '@nestjs/common';
import { JwtPayload, Token } from './jwt.type';
import * as jwt from 'jsonwebtoken';
import { plainToInstance } from 'class-transformer';
import { ConfigService } from '../config/config.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  generateToken(payload: JwtPayload): Token {
    const newToken = plainToInstance(Token, {
      accessToken: jwt.sign(
        Object.assign({}, payload),
        this.configService.getJwtConfig().accessTokenConfig.secret,
        {
          algorithm: 'HS256',
          jwtid: uuidv4(),
          expiresIn:
            this.configService.getJwtConfig().accessTokenConfig.expiresIn,
        }
      ),
      refreshToken: jwt.sign(
        Object.assign({}, payload),
        this.configService.getJwtConfig().refreshTokenConfig.secret,
        {
          algorithm: 'HS256',
          jwtid: uuidv4(),
          expiresIn:
            this.configService.getJwtConfig().refreshTokenConfig.expiresIn,
        }
      ),
    });
    return newToken;
  }

  verify(token: string, secret: string): JwtPayload {
    const payload = jwt.verify(token, secret) as JwtPayload;
    return payload;
  }

  decode(token: string): JwtPayload {
    const payload = jwt.decode(token) as JwtPayload;
    return payload;
  }
}
