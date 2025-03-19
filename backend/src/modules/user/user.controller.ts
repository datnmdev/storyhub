import {
  Body,
  Controller,
  Headers,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { EmailPasswordCredentialDto } from './dto/email-password-credential.dto';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { Token } from '@/common/jwt/jwt.type';
import { plainToClass } from 'class-transformer';
import { ConfigService } from '@/common/config/config.service';

@Controller('auth')
export class UserController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {}

  @Post('sign-in/email-password')
  async loginWithEmailPassword(
    @Body() emailPasswordCredentialDto: EmailPasswordCredentialDto,
    @Res() res: Response
  ) {
    const token = await this.userService.loginWithEmailPassword(
      emailPasswordCredentialDto
    );
    res.cookie('accessToken', token.accessToken, {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
      maxAge: this.configService.getJwtConfig().accessTokenConfig.expiresIn * 1000,
    });
    res.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: this.configService.getJwtConfig().refreshTokenConfig.expiresIn * 1000,
    });
    return res.status(HttpStatus.OK).send(true);
  }

  @Post('validate-token')
  async validateToken(@Headers('Authorization') authorization: string) {
    return await this.userService.validateToken(authorization);
  }

  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const oldToken = plainToClass(Token, {
      accessToken: req.cookies?.accessToken,
      refreshToken: req.cookies?.refreshToken,
    } as Token);
    const newToken = await this.userService.refreshToken(oldToken);
    res.cookie('accessToken', newToken.accessToken, {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
      maxAge: this.configService.getJwtConfig().accessTokenConfig.expiresIn * 1000,
    });
    res.cookie('refreshToken', newToken.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: this.configService.getJwtConfig().refreshTokenConfig.expiresIn * 1000,
    });
    return res.status(HttpStatus.OK).send(true);
  }

  @Post('sign-out')
  async signOut(@Req() req: Request, @Res() res: Response) {
    const token = plainToClass(Token, {
      accessToken: req.cookies?.accessToken,
      refreshToken: req.cookies?.refreshToken,
    } as Token);
    const isSignedOut = await this.userService.signOut(token);
    if (isSignedOut) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return res.status(HttpStatus.OK).send(true);
    }
    return res.status(HttpStatus.OK).send(false);
  }
}
