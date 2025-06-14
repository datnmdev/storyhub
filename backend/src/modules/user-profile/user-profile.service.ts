import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from './entities/user-profile.entity';
import UrlResolverUtils from '@/common/utils/url-resolver.util';
import { UrlCipherService } from '@/common/url-cipher/url-cipher.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { UrlPrefix } from '@/common/constants/url-resolver.constants';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
    private readonly urlCipherService: UrlCipherService
  ) {}

  async getProfile(id: number) {
    const profile = await this.userProfileRepository.findOne({
      where: {
        id,
      },
      relations: ['user'],
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

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    if (updateProfileDto.avatar) {
      updateProfileDto.avatar = UrlPrefix.INTERNAL_AWS_S3.concat(
        updateProfileDto.avatar
      );
    }
    const data = Object.fromEntries(
      Object.entries(updateProfileDto).filter(
        ([_, value]) => value !== undefined
      )
    );
    if (Object.keys(data).length > 0) {
      const result = await this.userProfileRepository.update(
        {
          id: userId,
        },
        data
      );
      if (result.affected > 0) {
        return true;
      }
    }
    return false;
  }
}
