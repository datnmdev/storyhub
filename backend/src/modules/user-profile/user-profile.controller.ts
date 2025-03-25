import { User } from '@/common/decorators/user.decorator';
import { Controller, Get, Param } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';

@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get('get-profile')
  async getProfile(@User('id') id: number) {
    return await this.userProfileService.getProfile(id);
  }

  @Get(':id/get-info')
  async getProfileUserInfo(@Param('id') id: number) {
    return await this.userProfileService.getProfile(id);
  }
}
