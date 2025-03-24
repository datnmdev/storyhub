import { Controller, Get, Query } from '@nestjs/common';
import { GetChapterWithFilterDto } from './dtos/get-chapter-with-filter.dto';
import { ChapterService } from './chapter.service';

@Controller('chapter')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}
  @Get('/filter')
  getChapterWithFilter(
    @Query() getChapterWithFilterDto: GetChapterWithFilterDto
  ) {
    return this.chapterService.getChapterWithFilter(getChapterWithFilterDto);
  }
}
