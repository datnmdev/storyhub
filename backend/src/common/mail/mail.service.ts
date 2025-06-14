import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendOtpToVerifyAccount(otp: string, to: string) {
    return this.mailerService.sendMail({
      to,
      from: 'no-reply@storyhub.com',
      subject: 'Xác thực tài khoản tại storyhub',
      template: './verify-account',
      context: {
        otp,
      },
    });
  }

  async sendOtpToResetPassword(otp: string, to: string) {
    return this.mailerService.sendMail({
      to,
      from: 'no-reply@storyhub.com',
      subject: 'Lấy lại mật khẩu tại storyhub',
      template: './reset-password',
      context: {
        otp,
      },
    });
  }

  async sendOtpToVerifyChangePassword(otp: string, to: string) {
    return this.mailerService.sendMail({
      to,
      from: 'no-reply@storyhub.com',
      subject: 'Xác thực việc đổi mật khẩu tại storyhub',
      template: './verify-change-password',
      context: {
        otp,
      },
    });
  }
}
