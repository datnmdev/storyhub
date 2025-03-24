import { Controller, Get, Query } from '@nestjs/common';
import { GetStoryWithFilterDto } from './dto/get-story-with-filter.dto';
import { StoryService } from './story.service';

@Controller('story')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Get('/filter')
  getStoryWithFilter(@Query() getStoryWithFilterDto: GetStoryWithFilterDto) {
    return this.storyService.getStoryWithFilter(getStoryWithFilterDto);
  }
}
