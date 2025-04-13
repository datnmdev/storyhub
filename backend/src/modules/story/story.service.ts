import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Story } from './entities/story.entity';
import { Brackets, DataSource, In, Repository } from 'typeorm';
import { UrlCipherService } from '@/common/url-cipher/url-cipher.service';
import { GetStoryWithFilterDto } from './dtos/get-story-with-filter.dto';
import { UrlCipherPayload } from '@/common/url-cipher/url-cipher.class';
import UrlResolverUtils from '@/common/utils/url-resolver.util';
import { StoryStatus } from '@/common/constants/story.constants';
import { plainToInstance } from 'class-transformer';
import { GetStoryWithFilterForAuthorDto } from './dtos/get-story-with-filter-for-author.dto';
import { UploadStoryDto } from './dtos/upload-story.dto';
import { UrlPrefix } from '@/common/constants/url-resolver.constants';
import { Genre } from '../genre/entities/genre.entity';
import { Price } from '../price/entities/price.entity';
import { Alias } from '../alias/entities/alias.entity';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story)
    private readonly storyRepository: Repository<Story>,
    private readonly urlCipherService: UrlCipherService,
    private readonly dataSource: DataSource
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

  async getStoryWithFilterForAuthor(
    authorId: number,
    getStoryWithFilterForAuthorDto: GetStoryWithFilterForAuthorDto
  ) {
    if (getStoryWithFilterForAuthorDto.genres) {
      const qb = this.storyRepository
        .createQueryBuilder('story')
        .innerJoin(
          'story.genres',
          'genre',
          getStoryWithFilterForAuthorDto.genres
            .map((genreId) => `genre.id = ${genreId}`)
            .join(' OR ')
        )
        .groupBy('story.id')
        .select(['story.*'])
        .addSelect('COUNT(*)', 'genreCount')
        .having('genreCount = :genreCount', {
          genreCount: getStoryWithFilterForAuthorDto.genres.length,
        })
        .andWhere(
          new Brackets((qb) => {
            if (getStoryWithFilterForAuthorDto.id) {
              qb.where('story.id = :id', {
                id: getStoryWithFilterForAuthorDto.id,
              });
            }
          })
        )
        .andWhere(
          new Brackets((qb) => {
            if (getStoryWithFilterForAuthorDto.title) {
              qb.where('story.title = :title', {
                title: getStoryWithFilterForAuthorDto.title,
              });
            }
          })
        )
        .andWhere(
          new Brackets((qb) => {
            if (getStoryWithFilterForAuthorDto.type) {
              getStoryWithFilterForAuthorDto.type.forEach((type, index) => {
                qb.orWhere(`story.type = :type${index}`, {
                  [`type${index}`]: type,
                });
              });
            }
          })
        )
        .andWhere(
          new Brackets((qb) => {
            if (getStoryWithFilterForAuthorDto.status) {
              getStoryWithFilterForAuthorDto.status.forEach((status, index) => {
                qb.orWhere(`story.status = :status${index}`, {
                  [`status${index}`]: status,
                });
              });
            }
          })
        )
        .andWhere(
          new Brackets((qb) => {
            if (getStoryWithFilterForAuthorDto.countryId) {
              qb.where('story.country_id = :country_id', {
                country_id: getStoryWithFilterForAuthorDto.countryId,
              });
            }
          })
        )
        .andWhere('story.author_id = :author_id', {
          author_id: authorId,
        });

      if (getStoryWithFilterForAuthorDto.orderBy) {
        getStoryWithFilterForAuthorDto.orderBy.forEach((value) => {
          qb.addOrderBy(`story.${value[0]}`, value[1]);
        });
      }
      qb.limit(getStoryWithFilterForAuthorDto.limit);
      qb.offset(
        (getStoryWithFilterForAuthorDto.page - 1) *
          getStoryWithFilterForAuthorDto.limit
      );
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
          if (getStoryWithFilterForAuthorDto.id) {
            qb.where('story.id = :id', {
              id: getStoryWithFilterForAuthorDto.id,
            });
          }
        })
      )
      .andWhere(
        new Brackets((qb) => {
          if (getStoryWithFilterForAuthorDto.title) {
            qb.where('story.title = :title', {
              title: getStoryWithFilterForAuthorDto.title,
            });
          }
        })
      )
      .andWhere(
        new Brackets((qb) => {
          if (getStoryWithFilterForAuthorDto.type) {
            getStoryWithFilterForAuthorDto.type.forEach((type, index) => {
              qb.orWhere(`story.type = :type${index}`, {
                [`type${index}`]: type,
              });
            });
          }
        })
      )
      .andWhere(
        new Brackets((qb) => {
          if (getStoryWithFilterForAuthorDto.status) {
            getStoryWithFilterForAuthorDto.status.forEach((status, index) => {
              qb.orWhere(`story.status = :status${index}`, {
                [`status${index}`]: status,
              });
            });
          }
        })
      )
      .andWhere(
        new Brackets((qb) => {
          if (getStoryWithFilterForAuthorDto.countryId) {
            qb.where('story.country_id = :country_id', {
              country_id: getStoryWithFilterForAuthorDto.countryId,
            });
          }
        })
      )
      .andWhere('story.author_id = :author_id', {
        author_id: authorId,
      });

    if (getStoryWithFilterForAuthorDto.orderBy) {
      getStoryWithFilterForAuthorDto.orderBy.forEach((value) => {
        qb.addOrderBy(`story.${value[0]}`, value[1]);
      });
    }
    qb.take(getStoryWithFilterForAuthorDto.limit);
    qb.skip(
      (getStoryWithFilterForAuthorDto.page - 1) *
        getStoryWithFilterForAuthorDto.limit
    );

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

  softDeleteStory(authorId: number, storyId: number) {
    return this.storyRepository.update(
      {
        id: storyId,
        authorId,
      },
      {
        status: StoryStatus.DELETED,
      }
    );
  }

  async uploadStory(authorId: number, uploadStoryDto: UploadStoryDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const createdAt = new Date();
      console.log(uploadStoryDto);

      // Tạo truyện
      const storyEntity = queryRunner.manager.create(Story, {
        title: uploadStoryDto.title,
        description: uploadStoryDto.description,
        notes: uploadStoryDto.notes,
        coverImage: UrlPrefix.INTERNAL_AWS_S3 + uploadStoryDto.coverImage,
        type: uploadStoryDto.type,
        status: StoryStatus.RELEASING,
        countryId: uploadStoryDto.countryId,
        authorId,
        createdAt,
        updatedAt: createdAt,
        genres: await queryRunner.manager.find(Genre, {
          where: {
            id: In(uploadStoryDto.genres),
          },
        }),
      });
      const newStory = await queryRunner.manager.save(storyEntity);

      // Tạo giá mỗi chương của truyện
      const priceEntity = queryRunner.manager.create(Price, {
        amount: uploadStoryDto.price,
        startTime: createdAt,
        createdAt,
        updatedAt: createdAt,
        storyId: newStory.id,
      });
      await queryRunner.manager.save(priceEntity);

      // Tạo alias cho truyện
      const aliasEntities = uploadStoryDto.alias.map((alias) =>
        queryRunner.manager.create(Alias, {
          name: alias,
          storyId: newStory.id,
        })
      );
      await queryRunner.manager.save(aliasEntities);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
