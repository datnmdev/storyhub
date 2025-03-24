import { Controller, Get, Query } from '@nestjs/common';
import { GetFollowerCountDto } from './dto/get-follower-count.dto';
import { FollowService } from './follow.service';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Get('count')
  getFollowerCount(@Query() getFollowerCountDto: GetFollowerCountDto) {
    return this.followService.getFollowerCount(getFollowerCountDto.storyId);
  }
}
