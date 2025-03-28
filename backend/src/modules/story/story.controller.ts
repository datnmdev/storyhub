import { Controller, Get, Query } from '@nestjs/common';
import { GetStoryWithFilterDto } from './dtos/get-story-with-filter.dto';
import { StoryService } from './story.service';
import { SearchStoryDto } from './dtos/search-story.dto';

@Controller('story')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Get('filter')
  getStoryWithFilter(@Query() getStoryWithFilterDto: GetStoryWithFilterDto) {
    return this.storyService.getStoryWithFilter(getStoryWithFilterDto);
  }

  @Get('get-genres')
  getGenresOfStory(@Query('storyId') storyId: number) {
    return this.storyService.getGenres(storyId);
  }

  @Get('search')
  search(@Query() searchStoryDto: SearchStoryDto) {
    return this.storyService.search(searchStoryDto.keyword);
  }
}
