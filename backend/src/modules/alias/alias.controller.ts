import { Controller, Get, Query } from '@nestjs/common';
import { AliasService } from './alias.service';
import { GetAliasByStoryIdDto } from './dtos/get-alias-by-story-id.dto';

@Controller('alias')
export class AliasController {
  constructor(private readonly aliasService: AliasService) {}

  @Get('get-by-story-id')
  getAliasByStoryId(@Query() getAliasByStoryId: GetAliasByStoryIdDto) {
    return this.aliasService.getAliasByStoryId(getAliasByStoryId.storyId);
  }
}
