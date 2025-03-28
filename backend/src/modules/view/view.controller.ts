import { Controller, Get, Param, Query } from '@nestjs/common';
import { getViewCountOfStoryDto } from './dtos/get-view-count-of-story.dto';
import { GetTopStoryDto } from './dtos/get-top-story.dto';
import { ViewService } from './view.service';
import { GetViewCountOfChapterDto } from './dtos/get-view-count-of-chapter.dto';
import { GetTopViewChartDataDto } from './dtos/get-top-view-chart-data.dto';

@Controller('view')
export class ViewController {
  constructor(private readonly viewService: ViewService) {}

  @Get('count/story/:storyId')
  getViewCountOfStory(@Param() getViewCountOfStoryDto: getViewCountOfStoryDto) {
    return this.viewService.getViewCountOfStory(getViewCountOfStoryDto.storyId);
  }

  @Get('get-top')
  getTopStory(@Query() getTopStoryDto: GetTopStoryDto) {
    return this.viewService.getTopStory(getTopStoryDto);
  }

  @Get('count/chapter/:chapterId')
  getViewCountOfChapter(
    @Param() getViewCountOfChapterDto: GetViewCountOfChapterDto
  ) {
    return this.viewService.getViewCountOfChapter(
      getViewCountOfChapterDto.chapterId
    );
  }

  @Get('/get-top-view-chart-data')
  getTopViewChartData(@Query() getTopViewChartDataDto: GetTopViewChartDataDto) {
    return this.viewService.getTopViewChartData(getTopViewChartDataDto.atTime);
  }
}
