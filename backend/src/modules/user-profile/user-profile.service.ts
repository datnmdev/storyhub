import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from './entities/user-profile.entity';
import UrlResolverUtils from '@/common/utils/url-resolver.util';
import { UrlCipherService } from '@/common/url-cipher/url-cipher.service';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly userRepository: Repository<UserProfile>,
    private readonly urlCipherService: UrlCipherService
  ) {}

  async getProfile(id: number) {
    const profile = await this.userRepository.findOneBy({
      id,
    });
    return {
      ...profile,
      avatar: profile.avatar
        ? UrlResolverUtils.createUrl(
            '/url-resolver',
            this.urlCipherService.generate({
              url: profile.avatar,
              expireIn: 30 * 60 * 60,
              iat: Date.now(),
            })
          )
        : profile.avatar,
    };
  }
}
