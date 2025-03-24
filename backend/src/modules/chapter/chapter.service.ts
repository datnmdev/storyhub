import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chapter } from './entities/chapter.entity';
import { Brackets, Repository } from 'typeorm';
import { GetChapterWithFilterDto } from './dtos/get-chapter-with-filter.dto';

@Injectable()
export class ChapterService {
  constructor(
    @InjectRepository(Chapter)
    private chapterRepository: Repository<Chapter>
  ) {}

  async getChapterWithFilter(getChapterWithFilterDto: GetChapterWithFilterDto) {
    const qb = this.chapterRepository
      .createQueryBuilder('chapter')
      .where(
        new Brackets((qb) => {
          if (getChapterWithFilterDto.id) {
            qb.where('chapter.id = :id', {
              id: getChapterWithFilterDto.id,
            });
          }
        })
      )
      .andWhere(
        new Brackets((qb) => {
          if (getChapterWithFilterDto.order) {
            qb.where('chapter.order = :order', {
              order: getChapterWithFilterDto.order,
            });
          }
        })
      )
      .andWhere(
        new Brackets((qb) => {
          if (getChapterWithFilterDto.name) {
            qb.where('chapter.name = :name', {
              name: getChapterWithFilterDto.name,
            });
          }
        })
      )
      .andWhere(
        new Brackets((qb) => {
          if (getChapterWithFilterDto.storyId) {
            qb.where('chapter.story_id = :storyId', {
              storyId: getChapterWithFilterDto.storyId,
            });
          }
        })
      );

    if (getChapterWithFilterDto.orderBy) {
      getChapterWithFilterDto.orderBy.forEach((value) => {
        qb.addOrderBy(`chapter.${value[0]}`, value[1]);
      });
    }
    qb.addOrderBy('chapter.id', 'ASC');
    qb.take(getChapterWithFilterDto.limit);
    qb.skip((getChapterWithFilterDto.page - 1) * getChapterWithFilterDto.limit);
    return qb.getManyAndCount();
  }
}
