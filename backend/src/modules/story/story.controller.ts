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
import { GetStoryWithFilterDto } from './dtos/get-story-with-filter.dto';
import { StoryService } from './story.service';
import { SearchStoryDto } from './dtos/search-story.dto';
import { GetStoryWithFilterForAuthorDto } from './dtos/get-story-with-filter-for-author.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/constants/user.constants';
import { RolesGuard } from '@/common/guards/roles.guard';
import { User } from '@/common/decorators/user.decorator';
import { UploadStoryDto } from './dtos/upload-story.dto';

@Controller('story')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Get('filter')
  getStoryWithFilter(@Query() getStoryWithFilterDto: GetStoryWithFilterDto) {
    return this.storyService.getStoryWithFilter(getStoryWithFilterDto);
  }

  @Get('author/filter')
  @Roles(Role.AUTHOR)
  @UseGuards(RolesGuard)
  getStoryWithFilterForAuthor(@User('id') authorId: number, @Query() getStoryWithFilterForAuthorDto: GetStoryWithFilterForAuthorDto) {
    return this.storyService.getStoryWithFilterForAuthor(authorId, getStoryWithFilterForAuthorDto);
  }

  @Get('get-genres')
  getGenresOfStory(@Query('storyId') storyId: number) {
    return this.storyService.getGenres(storyId);
  }

  @Get('search')
  search(@Query() searchStoryDto: SearchStoryDto) {
    return this.storyService.search(searchStoryDto.keyword);
  }

  @Put('author/soft-delete/:storyId')
  @Roles(Role.AUTHOR)
  @UseGuards(RolesGuard)
  softDeleteStory(
    @User('id') authorId: number,
    @Param('storyId') storyId: number
  ) {
    return this.storyService.softDeleteStory(authorId, storyId);
  }

  @Post()
  @Roles(Role.AUTHOR)
  @UseGuards(RolesGuard)
  uploadStory(
    @User('id') authorId: number,
    @Body() uploadStoryDto: UploadStoryDto
  ) {
    return this.storyService.uploadStory(authorId, uploadStoryDto);
  }
}
