import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import { AliasService } from './alias.service';
import { GetAliasByStoryIdDto } from './dtos/get-alias-by-story-id.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/constants/user.constants';
import { RolesGuard } from '@/common/guards/roles.guard';
import { User } from '@/common/decorators/user.decorator';
import {
  UpdateAliasBodyDto,
  UpdateAliasQueryDto,
} from './dtos/update-alias.dto';

@Controller('alias')
export class AliasController {
  constructor(private readonly aliasService: AliasService) {}

  @Get('get-by-story-id')
  getAliasByStoryId(@Query() getAliasByStoryId: GetAliasByStoryIdDto) {
    return this.aliasService.getAliasByStoryId(getAliasByStoryId.storyId);
  }

  @Put()
  @Roles(Role.AUTHOR)
  @UseGuards(RolesGuard)
  updateAlias(
    @User('id') authorId: number,
    @Query() updateAliasQueryDto: UpdateAliasQueryDto,
    @Body() updateAliasBodyDto: UpdateAliasBodyDto
  ) {
    return this.aliasService.updateAlias(
      authorId,
      updateAliasQueryDto.storyId,
      updateAliasBodyDto.alias
    );
  }
}
