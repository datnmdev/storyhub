import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GetChapterWithFilterDto } from './dtos/get-chapter-with-filter.dto';
import { ChapterService } from './chapter.service';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/constants/user.constants';
import { RolesGuard } from '@/common/guards/roles.guard';
import { User } from '@/common/decorators/user.decorator';
import { GetChapterContentDto } from './dtos/get-chapter-content';

@Controller('chapter')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}
  @Get('filter')
  getChapterWithFilter(
    @Query() getChapterWithFilterDto: GetChapterWithFilterDto
  ) {
    return this.chapterService.getChapterWithFilter(getChapterWithFilterDto);
  }

  @Get('reader/content')
  @Roles(Role.READER)
  @UseGuards(RolesGuard)
  getChapterContent(
    @User('id') userId: number,
    @Query() getChapterContentDto: GetChapterContentDto
  ) {
    return this.chapterService.getChapterContent(
      userId,
      getChapterContentDto.chapterTranlationId
    );
  }

  @Get('with-invoice-relation')
  @Roles(Role.READER, Role.GUEST)
  @UseGuards(RolesGuard)
  getChaptersWithInvoiceRelation(
    @User('id') userId: number,
    @Query() getChapterWithFilterDto: GetChapterWithFilterDto
  ) {
    return this.chapterService.getChaptersWithInvoiceRelation(
      userId,
      getChapterWithFilterDto
    );
  }
}
