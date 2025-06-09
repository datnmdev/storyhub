import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chapter } from './entities/chapter.entity';
import { Brackets, DataSource, Not, Repository } from 'typeorm';
import {
  ChapterInfoPublicDto,
  ChapterInfoPublicWithInvoiceRelationDto,
  GetChapterWithFilterDto,
} from './dtos/get-chapter-with-filter.dto';
import { PriceService } from '../price/price.service';
import { UrlCipherService } from '@/common/url-cipher/url-cipher.service';
import { ChapterStatus } from '@/common/constants/chapter.constants';
import { plainToInstance } from 'class-transformer';
import { NotEnoughMoneyException } from '@/common/exceptions/not-enough-money-exception';
import { StoryType } from '@/common/constants/story.constants';
import { InvoiceService } from '../invoice/invoice.service';
import { ChapterTranslation } from './entities/chapter-translation.entity';
import { ImageContentDto, TextContentDto } from './dtos/get-chapter-content';
import UrlResolverUtils from '@/common/utils/url-resolver.util';
import { UrlCipherPayload } from '@/common/url-cipher/url-cipher.class';
import { Role } from '@/common/constants/user.constants';
import { User } from '@/@types/express';
import { History } from '../history/entities/history.entity';
import { GetChapterForAuthorWithFilterDto } from './dtos/get-chapter-for-author-with-filter.dto';
import { UploadChapterDto } from './dtos/upload-chapter.dto';
import { Story } from '../story/entities/story.entity';
import { TextContent } from './entities/text-content.entity';
import { ImageContent } from './entities/image-content.entity';
import { UrlPrefix } from '@/common/constants/url-resolver.constants';
import { UpdateChapterBodyDto } from './dtos/update-chapter.dto';

@Injectable()
export class ChapterService {
  constructor(
    @InjectRepository(Chapter)
    private readonly chapterRepository: Repository<Chapter>,
    @InjectRepository(ChapterTranslation)
    private readonly chapterTranslationRepository: Repository<ChapterTranslation>,
    private readonly priceService: PriceService,
    private readonly dataSource: DataSource,
    private readonly urlCipherService: UrlCipherService,
    private readonly invoiceService: InvoiceService
  ) {}

  getOneBy(id: number) {
    return this.chapterRepository.findOne({
      where: {
        id,
      },
    });
  }

  async getChapterWithFilter(getChapterWithFilterDto: GetChapterWithFilterDto) {
    const qb = this.chapterRepository
      .createQueryBuilder('chapter')
      .innerJoinAndSelect('chapter.chapterTranslations', 'chapterTranslations')
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
      .andWhere('chapter.status = :status', {
        status: ChapterStatus.RELEASING,
      })
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
    qb.take(getChapterWithFilterDto.limit);
    qb.skip((getChapterWithFilterDto.page - 1) * getChapterWithFilterDto.limit);
    const chapters = await qb.getManyAndCount();
    return [plainToInstance(ChapterInfoPublicDto, chapters[0]), chapters[1]];
  }

  async getChapterContent(user: User, chapterTranslationId: number) {
    const now = new Date();
    const chapterTranslations = await this.chapterTranslationRepository.findOne(
      {
        where: {
          id: chapterTranslationId,
        },
        relations: ['chapter', 'chapter.story', 'textContent', 'imageContents'],
      }
    );

    if (chapterTranslations) {
      const currentPrice = await this.priceService.getPriceAt(
        chapterTranslations.chapter.storyId,
        now
      );
      if (currentPrice > 0) {
        if (user.role === Role.READER) {
          const isPaid = await this.invoiceService.getInvoiceBy(
            user.id,
            chapterTranslations.chapterId
          );
          // Kiểm tra thanh toán hay chưa?
          if (!isPaid) {
            throw new NotEnoughMoneyException();
          }
        } else {
          throw new NotEnoughMoneyException();
        }
      }

      // Lấy vị trí đọc truyện của người dùng
      const history = await this.dataSource
        .createQueryBuilder(History, 'history')
        .where('history.reader_id = :readerId', {
          readerId: user.id,
        })
        .andWhere('history.chapter_translation_id = :chapterTranslationId', {
          chapterTranslationId: chapterTranslations.id,
        })
        .getOne();

      // Kiểm tra loại truyện và trả về nội dung chương
      if (chapterTranslations.chapter.story.type === StoryType.COMIC) {
        return plainToInstance(ImageContentDto, {
          ...chapterTranslations.chapter,
          history,
          images: chapterTranslations.imageContents.map((imageContent) => ({
            ...imageContent,
            path: UrlResolverUtils.createUrl(
              '/url-resolver',
              this.urlCipherService.generate(
                plainToInstance(UrlCipherPayload, {
                  url: imageContent.path,
                  expireIn: 4 * 60 * 60,
                  iat: Date.now(),
                } as UrlCipherPayload)
              )
            ),
          })),
        } as ImageContentDto);
      } else {
        return plainToInstance(TextContentDto, {
          ...chapterTranslations.chapter,
          history,
          text: chapterTranslations.textContent,
        });
      }
    } else {
      throw new NotFoundException();
    }
  }

  async getChaptersWithInvoiceRelation(
    userId: number,
    getChapterWithFilterDto: GetChapterWithFilterDto
  ) {
    const qb = this.chapterRepository
      .createQueryBuilder('chapter')
      .innerJoinAndSelect('chapter.chapterTranslations', 'chapterTranslations')
      .innerJoinAndSelect('chapterTranslations.country', 'country')
      .leftJoinAndSelect(
        'chapter.invoices',
        'invoices',
        'invoices.chapter_id = chapter.id AND invoices.reader_id = :readerId',
        {
          readerId: userId,
        }
      )
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
      .andWhere('chapter.status = :status', {
        status: ChapterStatus.RELEASING,
      })
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
    qb.take(getChapterWithFilterDto.limit);
    qb.skip((getChapterWithFilterDto.page - 1) * getChapterWithFilterDto.limit);
    const chapters = await qb.getManyAndCount();
    return [
      plainToInstance(ChapterInfoPublicWithInvoiceRelationDto, chapters[0]),
      chapters[1],
    ];
  }

  getChapterTranslation(chapterId: number) {
    return this.chapterRepository.findOne({
      where: {
        id: chapterId,
      },
      relations: ['chapterTranslations', 'chapterTranslations.country'],
    });
  }

  async getChapterForAuthorWithFilter(
    authorId: number,
    getChapterForAuthorWithFilterDto: GetChapterForAuthorWithFilterDto
  ) {
    const qb = this.chapterRepository
      .createQueryBuilder('chapter')
      .innerJoinAndSelect('chapter.chapterTranslations', 'chapterTranslations')
      .leftJoinAndSelect('chapterTranslations.textContent', 'textContent')
      .leftJoinAndSelect('chapterTranslations.imageContents', 'imageContents')
      .innerJoinAndSelect(
        'chapter.story',
        'story',
        'chapter.story_id = story.id AND story.author_id = :authorId',
        {
          authorId,
        }
      )
      .where(
        new Brackets((qb) => {
          if (getChapterForAuthorWithFilterDto.keyword) {
            qb.where('MATCH(name) AGAINST (:keyword IN BOOLEAN MODE)', {
              keyword: getChapterForAuthorWithFilterDto.keyword,
            });
            if (!isNaN(Number(getChapterForAuthorWithFilterDto.keyword))) {
              qb.orWhere('chapter.id = :id', {
                id: Number(getChapterForAuthorWithFilterDto.keyword),
              });
            }
          }
        })
      )
      .andWhere(
        new Brackets((qb) => {
          if (getChapterForAuthorWithFilterDto.id) {
            qb.where('chapter.id = :id', {
              id: getChapterForAuthorWithFilterDto.id,
            });
          }
        })
      )
      .andWhere(
        new Brackets((qb) => {
          if (getChapterForAuthorWithFilterDto.order) {
            qb.where('chapter.order = :order', {
              order: getChapterForAuthorWithFilterDto.order,
            });
          }
        })
      )
      .andWhere(
        new Brackets((qb) => {
          if (getChapterForAuthorWithFilterDto.name) {
            qb.where('chapter.name = :name', {
              name: getChapterForAuthorWithFilterDto.name,
            });
          }
        })
      )
      .andWhere(
        new Brackets((qb) => {
          if (getChapterForAuthorWithFilterDto.status) {
            getChapterForAuthorWithFilterDto.status.forEach((status, index) => {
              qb.orWhere(`chapter.status = :status${index}`, {
                [`status${index}`]: status,
              });
            });
          }
        })
      )
      .andWhere(
        new Brackets((qb) => {
          if (getChapterForAuthorWithFilterDto.storyId) {
            qb.where('chapter.story_id = :storyId', {
              storyId: getChapterForAuthorWithFilterDto.storyId,
            });
          }
        })
      );

    if (getChapterForAuthorWithFilterDto.orderBy) {
      getChapterForAuthorWithFilterDto.orderBy.forEach((value) => {
        qb.addOrderBy(`chapter.${value[0]}`, value[1]);
      });
    }
    qb.take(getChapterForAuthorWithFilterDto.limit);
    qb.skip(
      (getChapterForAuthorWithFilterDto.page - 1) *
        getChapterForAuthorWithFilterDto.limit
    );
    return qb.getManyAndCount();
  }

  async softDeleteChapter(authorId: number, chapterId: number) {
    const chapter = await this.chapterRepository
      .createQueryBuilder('chapter')
      .innerJoin('chapter.story', 'story')
      .where('chapter.id = :chapterId', {
        chapterId,
      })
      .andWhere('story.author_id = :authorId', {
        authorId,
      })
      .getOne();

    if (chapter) {
      return this.chapterRepository.update(
        {
          id: chapterId,
        },
        {
          status: ChapterStatus.DELETED,
        }
      );
    }
    throw new ForbiddenException();
  }

  async uploadChapter(authorId: number, uploadChapterDto: UploadChapterDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const story = await this.dataSource.manager.findOne(Story, {
        where: {
          id: uploadChapterDto.storyId,
          authorId,
        },
      });
      if (story) {
        const now = new Date();
        const newestChapter = await this.dataSource.manager.find(Chapter, {
          where: {
            storyId: story.id,
            status: Not(ChapterStatus.DELETED),
          },
          order: {
            order: 'DESC',
          },
          take: 1,
        });
        const chapterEntity = this.chapterRepository.create({
          name: uploadChapterDto.name,
          order: newestChapter.length > 0 ? newestChapter[0].order + 1 : 1,
          status: ChapterStatus.UNRELEASED,
          createdAt: now,
          updatedAt: now,
          storyId: story.id,
        });
        const newChapter = await queryRunner.manager.save(chapterEntity);

        const chapterTranslationEntity = queryRunner.manager.create(
          ChapterTranslation,
          {
            chapterId: newChapter.id,
            countryId: story.countryId,
          }
        );
        const newChapterTranslation = await queryRunner.manager.save(
          chapterTranslationEntity
        );

        if (story.type === StoryType.NOVEL) {
          const textContentEntity = queryRunner.manager.create(TextContent, {
            chapterTranslationId: newChapterTranslation.id,
            content: uploadChapterDto.textContent.content,
          });
          await queryRunner.manager.save(textContentEntity);
        } else if (story.type === StoryType.COMIC) {
          const imageContentEntities = uploadChapterDto.imageContents.map(
            (imageContent) =>
              queryRunner.manager.create(ImageContent, {
                order: imageContent.order,
                path: UrlPrefix.INTERNAL_AWS_S3 + imageContent.path,
                chapterTranslationId: newChapterTranslation.id,
              })
          );
          await queryRunner.manager.save(imageContentEntities);
        }
        await queryRunner.commitTransaction();
        return newChapter;
      }
      throw new ForbiddenException();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateChapter(
    authorId: number,
    chapterId: number,
    updateChapterBodyDto: UpdateChapterBodyDto
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const chapter = await queryRunner.manager
        .createQueryBuilder(Chapter, 'chapter')
        .innerJoinAndSelect('chapter.story', 'story')
        .where('story.author_id = :authorId', {
          authorId,
        })
        .andWhere('chapter.id = :chapterId', {
          chapterId,
        })
        .getOne();
      if (chapter) {
        if (updateChapterBodyDto.name) {
          await queryRunner.manager.update(
            Chapter,
            {
              id: chapter.id,
            },
            {
              name: updateChapterBodyDto.name,
            }
          );
        }

        if (typeof updateChapterBodyDto.order === 'number') {
          const chapters = await queryRunner.manager.find(Chapter, {
            where: {
              storyId: chapter.storyId,
            },
          });
          if (
            updateChapterBodyDto.order > 0 &&
            updateChapterBodyDto.order <= chapters[chapters.length - 1].order
          ) {
            const needReUpdateChapters = chapters.filter(
              (chapter) => chapter.order >= updateChapterBodyDto.order
            );
            await queryRunner.manager.update(
              Chapter,
              {
                id: chapter.id,
              },
              {
                order: updateChapterBodyDto.order,
              }
            );
            for (const needReUpdateChapter of needReUpdateChapters) {
              await queryRunner.manager.update(
                Chapter,
                {
                  id: needReUpdateChapter.id,
                },
                {
                  order: needReUpdateChapter.order + 1,
                }
              );
            }
          }
        }

        const originalChapterTranslation = await queryRunner.manager.findOne(
          ChapterTranslation,
          {
            where: {
              chapterId: chapter.id,
              countryId: chapter.story.countryId,
            },
          }
        );

        if (updateChapterBodyDto.textContent) {
          await queryRunner.manager.update(
            TextContent,
            {
              chapterTranslationId: originalChapterTranslation.id,
            },
            {
              content: updateChapterBodyDto.textContent.content,
            }
          );
        }

        if (updateChapterBodyDto.imageContents) {
          await queryRunner.manager.delete(ImageContent, {
            chapterTranslationId: originalChapterTranslation.id,
          });
          const imageContentEntities = updateChapterBodyDto.imageContents.map(
            (imageContent) =>
              queryRunner.manager.create(ImageContent, {
                order: imageContent.order,
                path: imageContent.path.startsWith(UrlPrefix.INTERNAL_AWS_S3)
                  ? imageContent.path
                  : UrlPrefix.INTERNAL_AWS_S3 + imageContent.path,
                chapterTranslationId: originalChapterTranslation.id,
              })
          );
          await queryRunner.manager.save(imageContentEntities);
        }

        await queryRunner.commitTransaction();
        return true;
      }
      throw new ForbiddenException();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
