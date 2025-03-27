import { User } from '@/common/decorators/user.decorator';
import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';

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

  @Put()
  updateProfile(
    @User('id') userId: number,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    return this.userProfileService.updateProfile(userId, updateProfileDto);
  }
}
