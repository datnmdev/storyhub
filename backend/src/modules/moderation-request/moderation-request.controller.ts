import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ModerationRequestService } from './moderation-request.service';
import { Role } from '@/common/constants/user.constants';
import { Roles } from '@/common/decorators/roles.decorator';
import { RolesGuard } from '@/common/guards/roles.guard';
import { User } from '@/common/decorators/user.decorator';
import { CreateModerationRequestReqDto } from './dtos/create-moderation-request.dto';

@Controller('moderation-request')
export class ModerationRequestController {
  constructor(
    private readonly moderationRequestService: ModerationRequestService
  ) {}

  @Post()
  @Roles(Role.AUTHOR)
  @UseGuards(RolesGuard)
  createModerationRequest(
    @User('id') authorId: number,
    @Body()
    createModerationRequestDto: CreateModerationRequestReqDto
  ) {
    return this.moderationRequestService.createModerationRequest(
      authorId,
      createModerationRequestDto.chapterId
    );
  }
}
