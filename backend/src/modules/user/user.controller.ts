import {
  Body,
  Get,
  Query,
  Controller,
  Headers,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Token } from '@/common/jwt/jwt.type';
import { plainToClass } from 'class-transformer';
import { ConfigService } from '@/common/config/config.service';
import { UserService } from './user.service';
import { SignInWithEmailPasswordDto } from './dto/sign-in-with-email-password.dto';

@Controller('auth')
export class UserController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {}

  @Post('sign-in/email-password')
  async signWithEmailPassword(
    @Body() emailPasswordCredentialDto: SignInWithEmailPasswordDto,
    @Res() res: Response
  ) {
    const token = await this.userService.signInWithEmailPassword(
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

  @Get('sign-in/google')
  async signInWithGoogle(@Query('redirect-to') redirectTo: string, @Res() res: Response) {
    const url = await this.userService.signInWithGoogle(redirectTo);
    return res.redirect(url);
  }

  @Get('sign-in/google/callback')
  async signInWithGoogleCallback(
    @Query() query: ParameterDecorator,
    @Query('state') redirectTo: string,
    @Res() res: Response
  ) {
    const token = await this.userService.signInWithGoogleCallback(query);
    if (token) {
      // Lưu token vào cookies
      res.cookie('accessToken', token.accessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'prod',
        sameSite: 'strict',
      });
      res.cookie('refreshToken', token.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'prod',
        sameSite: 'strict',
      });
      return res.redirect(redirectTo);
    }
    return res.redirect(redirectTo);
  }

  @Post('validate-token')
  validateToken(@Headers('Authorization') authorization: string) {
    return this.userService.validateToken(authorization);
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
