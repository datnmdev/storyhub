import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ModerationRequestService } from './moderation-request.service';
import { Role } from '@/common/constants/user.constants';
import { Roles } from '@/common/decorators/roles.decorator';
import { RolesGuard } from '@/common/guards/roles.guard';
import { User } from '@/common/decorators/user.decorator';
import { CreateModerationRequestReqDto } from './dtos/create-moderation-request.dto';
import { GetModerationRequestReqDto } from './dtos/get-moderation-request.dto';
import { UpdateModerationRequestReqDto } from './dtos/update-moderation-request.dto';

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

  @Get()
  @Roles(Role.MODERATOR)
  @UseGuards(RolesGuard)
  getModerationRequests(
    @User('id') moderatorId: number,
    @Query()
    getModerationRequestDto: GetModerationRequestReqDto
  ) {
    return this.moderationRequestService.getModerationRequestsWithFilter(
      moderatorId,
      getModerationRequestDto
    );
  }

  @Put(':id')
  @Roles(Role.MODERATOR)
  @UseGuards(RolesGuard)
  updateModerationRequest(
    @Param('id') moderationRequestId: number,
    @User('id') moderatorId: number,
    @Body() updateModerationRequestReqDto: UpdateModerationRequestReqDto
  ) {
    return this.moderationRequestService.updateModerationRequest(
      moderatorId,
      moderationRequestId,
      updateModerationRequestReqDto
    );
  }
}
