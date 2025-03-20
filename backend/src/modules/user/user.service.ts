import { Inject, Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Transaction } from 'typeorm';
import { SignInWithEmailPasswordDto } from './dto/sign-in-with-email-password.dto';
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
import axios from 'axios';
import {
  AuthType,
  Role,
  UserStatus,
  OtpVerificationType,
} from '@/common/constants/user.constants';
import { UserProfile } from '../user-profile/entities/user-profile.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import { BullService } from '@/common/bull/bull.service';
import { JobName } from '@/common/constants/bull.constants';
import * as randomString from 'randomstring';
import { SendOtpData } from '@/common/types/mail.type';
import { SignUpDto } from './dto/sign-up.dto';
import { VerifyAccountDto } from './dto/verify-account.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import * as moment from 'moment';

@Injectable()
export class UserService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject(REDIS_CLIENT)
    private readonly redisClient: RedisClient,
    private readonly configService: ConfigService,
    private readonly bullService: BullService
  ) {}

  async signInWithEmailPassword(
    signInWithEmailPasswordDto: SignInWithEmailPasswordDto
  ) {
    // Kiểm tra tài khoản của địa chỉ email được yêu cầu đến có tồn tại hay không?
    const user = await this.userRepository.findOne({
      where: {
        email: signInWithEmailPasswordDto.email,
      },
    });
    if (user) {
      // Kiểm tra mật khẩu có khớp hay không?
      const checkPassword = await bcrypt.compare(
        signInWithEmailPasswordDto.password,
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

  async signInWithGoogle(qp: string) {
    const googleAuthUrl = this.configService.getGoogleConfig().authUrl;
    const params = new URLSearchParams({
      client_id: this.configService.getGoogleConfig().clientId,
      redirect_uri: this.configService.getGoogleConfig().callbackUrl,
      response_type: 'code',
      scope: 'profile email',
      access_type: 'offline',
      state: qp,
    });
    return `${googleAuthUrl}?${params.toString()}`;
  }

  async signInWithGoogleCallback(query: ParameterDecorator) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      const { code } = query as any;
      if (code) {
        const tokenResponse = await axios.post(
          this.configService.getGoogleConfig().tokenUrl,
          {
            code,
            client_id: this.configService.getGoogleConfig().clientId,
            client_secret: this.configService.getGoogleConfig().clientSecret,
            redirect_uri: this.configService.getGoogleConfig().callbackUrl,
            grant_type: 'authorization_code',
          }
        );
        const { access_token } = tokenResponse.data as any;
        const userInfoResponse = await axios.get(
          this.configService.getGoogleConfig().userInfoUrl,
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        );
        const userInfo = userInfoResponse.data as any;
        let payload: JwtPayload;

        // Thu hồi token google
        await axios.post('https://oauth2.googleapis.com/revoke', {
          token: access_token
        });

        // Kiểm tra và tạo tài khoản mới nêú chưa có
        const user = await this.userRepository.findOne({
          where: {
            suid: userInfo.id,
          },
        });
        if (!user) {
          // Bắt đầu transaction
          await queryRunner.startTransaction();

          // Tạo và lưu user mới
          const userEntity = plainToInstance(User, {
            authType: AuthType.GOOGLE,
            suid: userInfo.id,
            status: UserStatus.ACTIVATED,
            role: Role.READER,
            createdAt: new Date(),
          } as User);
          const newUser = await queryRunner.manager.save(userEntity);

          // Lưu profile người dùng
          const userProfileEntity = plainToInstance(UserProfile, {
            id: newUser.id,
            name: userInfo.name,
            avatar: userInfo.picture,
          });
          await queryRunner.manager.save(userProfileEntity);

          // Mở ví cho người dùng
          const walletEntity = plainToInstance(Wallet, {
            id: newUser.id,
            balance: '0',
          } as Wallet);
          await queryRunner.manager.save(walletEntity);

          // Thực hiện commit transaction
          await queryRunner.commitTransaction();

          // Cập nhật giá trị token payload
          payload = plainToInstance(JwtPayload, {
            id: newUser.id,
            status: newUser.status,
            role: newUser.role,
          } as JwtPayload);
        } else {
          // Cập nhật giá trị token payload
          payload = plainToInstance(JwtPayload, {
            id: user.id,
            status: user.status,
            role: user.role,
          } as JwtPayload);
        }

        return this.jwtService.generateToken(payload);
      }
      return null;
    } catch (error) {
      // Thực hiện rollback transaction
      await queryRunner.rollbackTransaction();
      return null;
    } finally {
      await queryRunner.release();
    }
  }

  async signInWithFacebook(qp: string) {
    const facebookAuthUrl = this.configService.getFacebookConfig().authUrl;
    const params = new URLSearchParams({
      client_id: this.configService.getFacebookConfig().clientId,
      redirect_uri: this.configService.getFacebookConfig().callbackUrl,
      response_type: 'code',
      scope: 'public_profile',
      state: qp,
    });
    return `${facebookAuthUrl}?${params.toString()}`;
  }

  async signInWithFacebookCallback(query: ParameterDecorator) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      const { code } = query as any;
      if (code) {
        const tokenResponse = await axios.post(
          this.configService.getFacebookConfig().tokenUrl,
          {
            code,
            client_id: this.configService.getFacebookConfig().clientId,
            client_secret: this.configService.getFacebookConfig().clientSecret,
            redirect_uri: this.configService.getFacebookConfig().callbackUrl,
          }
        );
        const { access_token } = tokenResponse.data as any;
        const userInfoResponse = await axios.get(
          this.configService.getFacebookConfig().userInfoUrl,
          {
            params: {
              fields: 'id,name,picture',
              access_token
            }
          }
        );
        const userInfo = userInfoResponse.data as any;
        let payload: JwtPayload;

        // Vô hiệu hoá token facebook
        await axios.delete(`https://graph.facebook.com/${userInfo.id}/permissions?access_token=${encodeURIComponent(access_token)}`)

        // Kiểm tra và tạo tài khoản mới nêú chưa có
        const user = await this.userRepository.findOne({
          where: {
            suid: userInfo.id,
            authType: AuthType.FACEBOOK
          },
        });
        if (!user) {
          // Bắt đầu transaction
          await queryRunner.startTransaction();

          // Tạo và lưu user mới
          const userEntity = plainToInstance(User, {
            authType: AuthType.FACEBOOK,
            suid: userInfo.id,
            status: UserStatus.ACTIVATED,
            role: Role.READER,
            createdAt: new Date(),
          } as User);
          const newUser = await queryRunner.manager.save(userEntity);

          // Lưu profile người dùng
          const userProfileEntity = plainToInstance(UserProfile, {
            id: newUser.id,
            name: userInfo.name,
            avatar: userInfo.picture.data.url,
          });
          await queryRunner.manager.save(userProfileEntity);

          // Mở ví cho người dùng
          const walletEntity = plainToInstance(Wallet, {
            id: newUser.id,
            balance: '0',
          } as Wallet);
          await queryRunner.manager.save(walletEntity);

          // Thực hiện commit transaction
          await queryRunner.commitTransaction();

          // Cập nhật giá trị token payload
          payload = plainToInstance(JwtPayload, {
            id: newUser.id,
            status: newUser.status,
            role: newUser.role,
          } as JwtPayload);
        } else {
          // Cập nhật giá trị token payload
          payload = plainToInstance(JwtPayload, {
            id: user.id,
            status: user.status,
            role: user.role,
          } as JwtPayload);
        }

        return this.jwtService.generateToken(payload);
      }
      return null;
    } catch (error) {
      // Thực hiện rollback transaction
      await queryRunner.rollbackTransaction();
      return null;
    } finally {
      await queryRunner.release();
    }
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

      return false;
    } catch (error) {
      return false;
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
      const refreshTokenPayload = this.jwtService.decode(token.refreshToken);
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
      return false;
    }
  }

  async signUp(signUpDto: SignUpDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();

      // Lưu thông tin người dùng
      const userEntity = plainToInstance(User, {
        authType: 'email_password',
        email: signUpDto.email,
        password: await bcrypt.hash(signUpDto.password, 10),
        role: signUpDto.type,
        status: UserStatus.UNACTIVATED,
        createdAt: new Date(),
      } as User)
      const newUser = await queryRunner.manager.save(userEntity);

      const userProfileEntity = plainToInstance(UserProfile, {
        id: newUser.id,
        name: signUpDto.name,
        dob: moment(signUpDto.dob).format('YYYY-MM-DD HH:mm:ss'),
        gender: signUpDto.gender,
        phone: signUpDto.phone,
        countryId: 1
      } as UserProfile);
      await queryRunner.manager.save(userProfileEntity);

      const walletEntity = plainToInstance(Wallet, {
        id: newUser.id,
        balance: '0',
      });
      await queryRunner.manager.save(walletEntity);

      // Gửi mã otp xác thực
      const jobData: SendOtpData = {
        accountId: newUser.id,
        otp: randomString.generate({
          length: 6,
          charset: 'numeric',
        }),
        to: signUpDto.email,
      };
      await this.bullService.addJob(
        JobName.SEND_OTP_TO_VERIFY_ACCOUNT,
        jobData
      );
      await queryRunner.commitTransaction();
      return newUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async validateEmail(email: string) {
    const user =
      await this.userRepository.findOne({
        where: {
          email,
        },
      });
    if (user) {
      return true;
    }
    return false;
  }

  async verifyAccount(verifyAccountDto: VerifyAccountDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const otp = await this.redisClient.get(
        KeyGenerator.otpToVerifyAccountKey(verifyAccountDto.accountId)
      );
      if (verifyAccountDto.otp === otp) {
        await queryRunner.manager.update(User, verifyAccountDto.accountId, {
          status: UserStatus.ACTIVATED,
        });
        await this.redisClient.del(
          KeyGenerator.otpToVerifyAccountKey(verifyAccountDto.accountId)
        );
        await queryRunner.commitTransaction();
        return true;
      }
      return false;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  async resendOtp(resendOtpDto: ResendOtpDto) {
    const user =
      await this.userRepository.findOne({
        where: {
          email: resendOtpDto.email,
        }
      });
    if (user) {
      switch (resendOtpDto.type) {
        case OtpVerificationType.SIGN_IN:
        case OtpVerificationType.SIGN_UP:
          if (
            user.status === UserStatus.UNACTIVATED
          ) {
            const jobData: SendOtpData = {
              accountId: user.id,
              otp: randomString.generate({
                length: 6,
                charset: 'numeric',
              }),
              to: user.email,
            };
            await this.bullService.addJob(
              JobName.SEND_OTP_TO_VERIFY_ACCOUNT,
              jobData
            );
          }
          break;

        case OtpVerificationType.FORGOT_PASSWORD:
          break;
      }
    }
    return true;
  }
}
