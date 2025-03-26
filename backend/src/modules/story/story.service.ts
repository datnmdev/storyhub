import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Story } from './entities/story.entity';
import { Brackets, Repository } from 'typeorm';
import { UrlCipherService } from '@/common/url-cipher/url-cipher.service';
import { GetStoryWithFilterDto } from './dto/get-story-with-filter.dto';
import { UrlCipherPayload } from '@/common/url-cipher/url-cipher.class';
import UrlResolverUtils from '@/common/utils/url-resolver.util';
import { StoryStatus } from '@/common/constants/story.constants';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story)
    private readonly storyRepository: Repository<Story>,
    private readonly urlCipherService: UrlCipherService
  ) {}

  findOne(id: number): Promise<Story> {
    return this.storyRepository.findOne({
      where: {
        id,
      },
    });
  }

  async getStoryWithFilter(getStoryWithFilterDto: GetStoryWithFilterDto) {
    if (getStoryWithFilterDto.genres) {
      const qb = this.storyRepository
        .createQueryBuilder('story')
        .innerJoin(
          'story.genres',
          'genre',
          getStoryWithFilterDto.genres
            .map((genreId) => `genre.id = ${genreId}`)
            .join(' OR ')
        )
        .groupBy('story.id')
        .select(['story.*'])
        .addSelect('COUNT(*)', 'genreCount')
        .having('genreCount = :genreCount', {
          genreCount: getStoryWithFilterDto.genres.length,
        })
        .andWhere(
          new Brackets((qb) => {
            if (getStoryWithFilterDto.id) {
              qb.where('story.id = :id', {
                id: getStoryWithFilterDto.id,
              });
            }
          })
        )
        .andWhere(
          new Brackets((qb) => {
            if (getStoryWithFilterDto.title) {
              qb.where('story.title = :title', {
                title: getStoryWithFilterDto.title,
              });
            }
          })
        )
        .andWhere(
          new Brackets((qb) => {
            if (getStoryWithFilterDto.type) {
              getStoryWithFilterDto.type.forEach((type, index) => {
                qb.orWhere(`story.type = :type${index}`, {
                  [`type${index}`]: type,
                });
              });
            }
          })
        )
        .andWhere(
          new Brackets((qb) => {
            if (getStoryWithFilterDto.status) {
              getStoryWithFilterDto.status.forEach((status, index) => {
                qb.orWhere(`story.status = :status${index}`, {
                  [`status${index}`]: status,
                });
              });
            }
          })
        )
        .andWhere(
          new Brackets((qb) => {
            if (getStoryWithFilterDto.countryId) {
              qb.where('story.country_id = :country_id', {
                country_id: getStoryWithFilterDto.countryId,
              });
            }
          })
        )
        .andWhere(
          new Brackets((qb) => {
            if (getStoryWithFilterDto.authorId) {
              qb.where('story.author_id = :author_id', {
                author_id: getStoryWithFilterDto.authorId,
              });
            }
          })
        );

      if (getStoryWithFilterDto.orderBy) {
        getStoryWithFilterDto.orderBy.forEach((value) => {
          qb.addOrderBy(`story.${value[0]}`, value[1]);
        });
      }
      qb.limit(getStoryWithFilterDto.limit);
      qb.offset((getStoryWithFilterDto.page - 1) * getStoryWithFilterDto.limit);
      const stories = await qb.getRawMany();
      return [
        stories.map((story) => {
          return {
            id: story.id,
            title: story.title,
            description: story.description,
            note: story.note,
            coverImage: UrlResolverUtils.createUrl(
              '/url-resolver',
              this.urlCipherService.generate(
                plainToInstance(UrlCipherPayload, {
                  url: story.cover_image,
                  expireIn: 4 * 60 * 60,
                  iat: Date.now(),
                } as UrlCipherPayload)
              )
            ),
            type: story.type,
            status: story.status,
            createdAt: story.created_at,
            updatedAt: story.updated_at,
            countryId: story.country_id,
            authorId: story.author_id,
          };
        }),
        stories.length,
      ];
    }

    const qb = this.storyRepository
      .createQueryBuilder('story')
      .where(
        new Brackets((qb) => {
          if (getStoryWithFilterDto.id) {
            qb.where('story.id = :id', {
              id: getStoryWithFilterDto.id,
            });
          }
        })
      )
      .andWhere(
        new Brackets((qb) => {
          if (getStoryWithFilterDto.title) {
            qb.where('story.title = :title', {
              title: getStoryWithFilterDto.title,
            });
          }
        })
      )
      .andWhere(
        new Brackets((qb) => {
          if (getStoryWithFilterDto.type) {
            getStoryWithFilterDto.type.forEach((type, index) => {
              qb.orWhere(`story.type = :type${index}`, {
                [`type${index}`]: type,
              });
            });
          }
        })
      )
      .andWhere(
        new Brackets((qb) => {
          if (getStoryWithFilterDto.status) {
            getStoryWithFilterDto.status.forEach((status, index) => {
              qb.orWhere(`story.status = :status${index}`, {
                [`status${index}`]: status,
              });
            });
          }
        })
      )
      .andWhere(
        new Brackets((qb) => {
          if (getStoryWithFilterDto.countryId) {
            qb.where('story.country_id = :country_id', {
              country_id: getStoryWithFilterDto.countryId,
            });
          }
        })
      )
      .andWhere(
        new Brackets((qb) => {
          if (getStoryWithFilterDto.authorId) {
            qb.where('story.author_id = :author_id', {
              author_id: getStoryWithFilterDto.authorId,
            });
          }
        })
      );

    if (getStoryWithFilterDto.orderBy) {
      getStoryWithFilterDto.orderBy.forEach((value) => {
        qb.addOrderBy(`story.${value[0]}`, value[1]);
      });
    }
    qb.addOrderBy('story.id', 'ASC');
    qb.take(getStoryWithFilterDto.limit);
    qb.skip((getStoryWithFilterDto.page - 1) * getStoryWithFilterDto.limit);

    const stories = await qb.getManyAndCount();
    return [
      stories[0].map((story) => {
        const payload: UrlCipherPayload = {
          url: story.coverImage,
          expireIn: 4 * 60 * 60,
          iat: Date.now(),
        };
        const encryptedUrl = this.urlCipherService.generate(payload);
        return {
          ...story,
          coverImage: UrlResolverUtils.createUrl('/url-resolver', encryptedUrl),
        };
      }),
      stories[1],
    ];
  }

  async getGenres(storyId: number) {
    const story = await this.storyRepository.findOne({
      where: {
        id: storyId,
      },
      relations: ['genres'],
    });

    return story.genres;
  }

  async search(keyword: string) {
    const results = await this.storyRepository
      .createQueryBuilder('story')
      .innerJoinAndSelect('story.author', 'author')
      .innerJoinAndSelect('story.country', 'country')
      .innerJoinAndSelect('author.userProfile', 'userProfile')
      .where(
        new Brackets((qb) => {
          qb.where(`MATCH (story.title) AGAINST (:title)`, {
            title: keyword,
          });
        })
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where('story.status = :status1', {
            status1: StoryStatus.RELEASING,
          }).orWhere('story.status = :status2', {
            status2: StoryStatus.COMPLETED,
          });
        })
      )
      .getManyAndCount();

    return [
      results[0].map((story) => ({
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
      })),
      results[1],
    ];
  }
}
