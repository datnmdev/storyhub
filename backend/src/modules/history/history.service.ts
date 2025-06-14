import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import UrlResolverUtils from '@/common/utils/url-resolver.util';
import { UrlCipherPayload } from '@/common/url-cipher/url-cipher.class';
import { UrlCipherService } from '@/common/url-cipher/url-cipher.service';
import { History } from './entities/history.entity';
import { Story } from '../story/entities/story.entity';
import { CreateHistoryDto } from './dtos/create-reading-history.dto';
import { GetHistoryWithFilterDto } from './dtos/get-reading-history-with-filter.dto';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
    private readonly urlCipherService: UrlCipherService
  ) {}

  async createHistory(userId: number, createHistoryDto: CreateHistoryDto) {
    const history = await this.historyRepository.findOne({
      where: {
        readerId: userId,
        chapterTranslationId: createHistoryDto.chapterTranslationId,
      },
    });

    if (history) {
      return this.historyRepository.update(
        {
          readerId: userId,
          chapterTranslationId: createHistoryDto.chapterTranslationId,
        },
        {
          position: createHistoryDto.position,
          updatedAt: new Date(),
        }
      );
    }

    return this.historyRepository.save({
      position: createHistoryDto.position,
      chapterTranslationId: createHistoryDto.chapterTranslationId,
      readerId: userId,
    });
  }

  async deleteHistoryByChapterTranslationId(
    userId: number,
    chapterTranslationId: number
  ) {
    const result = await this.historyRepository.delete({
      readerId: userId,
      chapterTranslationId,
    });
    if (result.affected > 0) {
      return true;
    }
    return false;
  }

  async deleteHistoryByStoryId(userId: number, storyId: number) {
    const histories = await this.historyRepository
      .createQueryBuilder('history')
      .innerJoin('history.chapterTranslation', 'chapterTranslation')
      .innerJoin('chapterTranslation.chapter', 'chapter')
      .select('history.id')
      .where('history.reader_id = :readerId', { readerId: userId })
      .andWhere('chapter.story_id = :storyId', { storyId })
      .getMany();

    if (histories.length > 0) {
      const ids = histories.map((history) => history.id);
      const result = await this.historyRepository
        .createQueryBuilder()
        .delete()
        .from('history')
        .where('id IN (:...ids)', { ids })
        .execute();
      if (result.affected > 0) {
        return true;
      }
    }
    return false;
  }

  async getHistoryWithFilter(
    userId: number,
    getReadingHistoryWithFilterDto: GetHistoryWithFilterDto
  ) {
    const result = await this.historyRepository
      .createQueryBuilder('history')
      .innerJoinAndSelect('history.chapterTranslation', 'chapterTranslation')
      .innerJoinAndSelect('chapterTranslation.chapter', 'chapter')
      .innerJoinAndSelect('chapter.story', 'story')
      .where('history.reader_id = :readerId', {
        readerId: userId,
      })
      .orderBy('history.updatedAt', 'DESC')
      .addOrderBy('history.createdAt', 'DESC')
      .getManyAndCount();

    const filteredStories: Story[] = [];
    result[0].forEach((history) => {
      if (
        filteredStories.every(
          (story) => history.chapterTranslation.chapter.storyId != story.id
        )
      ) {
        filteredStories.push(history.chapterTranslation.chapter.story);
      }
    });

    return [
      filteredStories
        .slice(
          (getReadingHistoryWithFilterDto.page - 1) *
            getReadingHistoryWithFilterDto.limit,
          getReadingHistoryWithFilterDto.limit *
            getReadingHistoryWithFilterDto.page
        )
        .map((story) => {
          return {
            ...story,
            coverImage: UrlResolverUtils.createUrl(
              '/url-resolver',
              this.urlCipherService.generate(
                plainToInstance(UrlCipherPayload, {
                  url: story.coverImage,
                  expireIn: 4 * 60 * 60,
                  iat: Date.now(),
                } as UrlCipherPayload)
              )
            ),
            histories: result[0].filter(
              (history) =>
                history.chapterTranslation.chapter.storyId === story.id
            ),
          };
        }),
      filteredStories.length,
    ];
  }

  async deleteAll(userId: number) {
    const result = await this.historyRepository.delete({
      readerId: userId,
    });
    if (result.affected > 0) {
      return true;
    }
    return false;
  }
}
