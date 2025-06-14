import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from '@/common/decorators/user.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/constants/user.constants';
import { RolesGuard } from '@/common/guards/roles.guard';
import { HistoryService } from './history.service';
import { CreateHistoryDto } from './dtos/create-reading-history.dto';
import { DeleteHistoryByChapterTranslationIdDto } from './dtos/delete-reading-history-by-chapter-id.dto';
import { DeleteHistoryByStoryIdDto } from './dtos/delete-reading-history-by-story-id.dto';
import { GetHistoryWithFilterDto } from './dtos/get-reading-history-with-filter.dto';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  @Roles(Role.READER)
  @UseGuards(RolesGuard)
  createHistory(
    @User('id') userId: number,
    @Body() createHistoryDto: CreateHistoryDto
  ) {
    return this.historyService.createHistory(userId, createHistoryDto);
  }

  @Delete('delete-by-chapter-translation-id')
  @Roles(Role.READER)
  @UseGuards(RolesGuard)
  deleteHistoryByChapterTranslationId(
    @User('id') userId: number,
    @Query()
    deleteHistoryByChapterTranslationIdDto: DeleteHistoryByChapterTranslationIdDto
  ) {
    return this.historyService.deleteHistoryByChapterTranslationId(
      userId,
      deleteHistoryByChapterTranslationIdDto.chapterTranslationId
    );
  }

  @Delete('delete-by-story-id')
  @Roles(Role.READER)
  @UseGuards(RolesGuard)
  deleteHistoryByStoryId(
    @User('id') userId: number,
    @Query() deleteHistoryByStoryIdDto: DeleteHistoryByStoryIdDto
  ) {
    return this.historyService.deleteHistoryByStoryId(
      userId,
      deleteHistoryByStoryIdDto.storyId
    );
  }

  @Get('filter')
  @Roles(Role.READER)
  @UseGuards(RolesGuard)
  getHistoryWithFilter(
    @User('id') userId: number,
    @Query() getHistoryWithFilterDto: GetHistoryWithFilterDto
  ) {
    return this.historyService.getHistoryWithFilter(
      userId,
      getHistoryWithFilterDto
    );
  }

  @Delete('all')
  @Roles(Role.READER)
  @UseGuards(RolesGuard)
  deleteAllHistory(@User('id') userId: number) {
    return this.historyService.deleteAll(userId);
  }
}
