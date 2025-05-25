import { Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { GetChapterWithFilterDto } from './dtos/get-chapter-with-filter.dto';
import { ChapterService } from './chapter.service';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/constants/user.constants';
import { RolesGuard } from '@/common/guards/roles.guard';
import { User } from '@/common/decorators/user.decorator';
import { GetChapterContentDto } from './dtos/get-chapter-content';
import { User as UserPayload } from '@/@types/express';
import { GetChapterForAuthorWithFilterDto } from './dtos/get-chapter-for-author-with-filter.dto';

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
  @Roles(Role.READER, Role.GUEST)
  @UseGuards(RolesGuard)
  getChapterContent(
    @User() user: UserPayload,
    @Query() getChapterContentDto: GetChapterContentDto
  ) {
    return this.chapterService.getChapterContent(
      user,
      getChapterContentDto.chapterTranslationId
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

  @Get(':id/translations')
  getChapterTranslation(@Param('id') chapterId: number) {
    return this.chapterService.getChapterTranslation(chapterId);
  }

  @Get('/author/filter')
  @Roles(Role.AUTHOR)
  @UseGuards(RolesGuard)
  getChapterForAuthorWithFilter(
    @User('id') authorId: number,
    @Query() getChapterForAuthorWithFilterDto: GetChapterForAuthorWithFilterDto
  ) {
    return this.chapterService.getChapterForAuthorWithFilter(
      authorId,
      getChapterForAuthorWithFilterDto
    );
  }

  @Put('author/soft-delete/:chapterId')
  @Roles(Role.AUTHOR)
  @UseGuards(RolesGuard)
  softDeleteChapter(
    @User('id') authorId: number,
    @Param('chapterId') chapterId: number
  ) {
    return this.chapterService.softDeleteChapter(authorId, chapterId);
  }
}
