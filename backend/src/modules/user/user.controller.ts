import {
  Body,
  Get,
  Query,
  Headers,
  HttpStatus,
  Post,
  Req,
  Res,
  Controller,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Token } from '@/common/jwt/jwt.type';
import { plainToClass } from 'class-transformer';
import { ConfigService } from '@/common/config/config.service';
import { UserService } from './user.service';
import { SignInWithEmailPasswordDto } from './dtos/sign-in-with-email-password.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { ValidateEmailDto } from './dtos/validate-email.dto';
import { VerifyAccountDto } from './dtos/verify-account.dto';
import { ResendOtpDto } from './dtos/resend-otp.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { User } from '@/common/decorators/user.decorator';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { VerifyChangePasswordInfoDto } from './dtos/verify-change-password-info.dto';

@Controller('auth')
export class AuthController {
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
    return res.status(HttpStatus.OK).send(token);
  }

  @Get('sign-in/google')
  async signInWithGoogle(
    @Query('redirect-to') redirectTo: string,
    @Res() res: Response
  ) {
    const url = await this.userService.signInWithGoogle(redirectTo);
    return res.redirect(url);
  }

  @Get('sign-in/google/callback')
  async signInWithGoogleCallback(
    @Query() query: any,
    @Query('state') redirectTo: string,
    @Res() res: Response
  ) {
    const token = await this.userService.signInWithGoogleCallback(query);
    const queryParams = new URLSearchParams({
      'access-token': token.accessToken,
      'refresh-token': token.refreshToken,
    });
    if (token) {
      return res.redirect(`${redirectTo}&${queryParams}`);
    }
    return res.redirect(`${redirectTo}&${queryParams}`);
  }

  @Get('sign-in/facebook')
  async signInWithFacebook(
    @Query('redirect-to') redirectTo: string,
    @Res() res: Response
  ) {
    const url = await this.userService.signInWithFacebook(redirectTo);
    return res.redirect(url);
  }

  @Get('sign-in/facebook/callback')
  async signInWithFacebookCallback(
    @Query() query: any,
    @Query('state') redirectTo: string,
    @Res() res: Response
  ) {
    const token = await this.userService.signInWithFacebookCallback(query);
    const queryParams = new URLSearchParams({
      'access-token': token.accessToken,
      'refresh-token': token.refreshToken,
    });
    if (token) {
      return res.redirect(`${redirectTo}&${queryParams}`);
    }
    return res.redirect(`${redirectTo}&${queryParams}`);
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
    return res.status(HttpStatus.OK).send(newToken);
  }

  @Post('sign-out')
  async signOut(@Req() req: Request, @Res() res: Response) {
    const token = plainToClass(Token, {
      accessToken: req.cookies?.accessToken,
      refreshToken: req.cookies?.refreshToken,
    } as Token);
    const isSignedOut = await this.userService.signOut(token);
    if (isSignedOut) {
      return res.status(HttpStatus.OK).send(true);
    }
    return res.status(HttpStatus.OK).send(false);
  }

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.userService.signUp(signUpDto);
  }

  @Get('validate-email')
  validateEmail(@Query() validateEmailDto: ValidateEmailDto) {
    return this.userService.validateEmail(validateEmailDto.email);
  }

  @Post('verify-account')
  verifyAccount(@Body() verifyAccountDto: VerifyAccountDto) {
    return this.userService.verifyAccount(verifyAccountDto);
  }

  @Post('resend-otp')
  resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return this.userService.resendOtp(resendOtpDto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.userService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.userService.resetPassword(resetPasswordDto);
  }

  @Post('verify-change-password-info')
  verifyChangePasswordInfo(
    @User('id') userId: number,
    @Body() verifyChangePasswordInfoDto: VerifyChangePasswordInfoDto
  ) {
    return this.userService.verifyChangePasswordInfo(
      userId,
      verifyChangePasswordInfoDto
    );
  }

  @Post('change-password')
  changePassword(
    @User('id') userId: number,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    return this.userService.changePassword(userId, changePasswordDto);
  }
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get-all-author')
  getAllAuthor() {
    return this.userService.getAllAuthor();
  }
}
