import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from './entities/user-profile.entity';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly userRepository: Repository<UserProfile>
  ) {}

  async getProfile(id: number) {
    const profile = await this.userRepository.findOneBy({
      id,
    });
    return profile;
  }
}
