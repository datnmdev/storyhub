import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chapter } from './entities/chapter.entity';
import { Brackets, DataSource, Repository } from 'typeorm';
import {
  ChapterInfoPublicDto,
  ChapterInfoPublicWithInvoiceRelationDto,
  GetChapterWithFilterDto,
} from './dtos/get-chapter-with-filter.dto';
import { PriceService } from '../price/price.service';
import { WalletService } from '../wallet/wallet.service';
import { UrlCipherService } from '@/common/url-cipher/url-cipher.service';
import { ChapterStatus } from '@/common/constants/chapter.constants';
import { plainToInstance } from 'class-transformer';
import { Invoice } from '../invoice/entities/invoice.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import { NotEnoughMoneyException } from '@/common/exceptions/NotEnoughMoneyException';
import { StoryType } from '@/common/constants/story.constants';
import { InvoiceService } from '../invoice/invoice.service';
import { ChapterTranslation } from '../chapter-translation/entities/chapter-translation.entity';
import { ImageContentDto, TextContentDto } from './dtos/get-chapter-content';
import UrlResolverUtils from '@/common/utils/url-resolver.util';
import { UrlCipherPayload } from '@/common/url-cipher/url-cipher.class';

@Injectable()
export class ChapterService {
  constructor(
    @InjectRepository(Chapter)
    private readonly chapterRepository: Repository<Chapter>,
    @InjectRepository(ChapterTranslation)
    private readonly chapterTranslationRepository: Repository<ChapterTranslation>,
    private readonly priceService: PriceService,
    private readonly dataSource: DataSource,
    private readonly walletService: WalletService,
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

  async getChapterContent(userId: number, chapterTranslationId: number) {
    const now = new Date();
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const chapterTrans = await this.chapterTranslationRepository.findOne({
        where: {
          id: chapterTranslationId,
        },
        relations: ['chapter', 'chapter.story', 'textContent', 'imageContents'],
      });

      if (chapterTrans) {
        // Kiểm tra thanh toán hay chưa?
        const isPaid = await this.invoiceService.getInvoiceBy(
          userId,
          chapterTrans.chapterId
        );
        if (!isPaid) {
          const currentPrice = await this.priceService.getPriceAt(
            chapterTrans.chapter.storyId,
            now
          );
          const readerWallet = await this.walletService.findWalletBy(userId);
          const authorWallet = await this.walletService.findWalletBy(
            chapterTrans.chapter.story.authorId
          );
          // Kiểm tra ví tiền có đủ tiền không
          if (Number(readerWallet.balance) >= currentPrice) {
            const invoiceEntity = plainToInstance(Invoice, {
              readerId: userId,
              chapterId: chapterTrans.chapterId,
              totalAmount: String(currentPrice),
              createdAt: now,
            } as Invoice);
            await queryRunner.manager.save(invoiceEntity);
            await queryRunner.manager.update(Wallet, userId, {
              balance: String(Number(readerWallet.balance) - currentPrice),
            });
            await queryRunner.manager.update(
              Wallet,
              chapterTrans.chapter.story.authorId,
              {
                balance: String(
                  Number(authorWallet.balance) + Math.floor(currentPrice * 0.9)
                ),
              }
            );
            await queryRunner.commitTransaction();
          } else {
            throw new NotEnoughMoneyException();
          }
        }

        // Kiểm tra loại truyện và trả về nội dung chương
        if (chapterTrans.chapter.story.type === StoryType.COMIC) {
          return plainToInstance(ImageContentDto, {
            ...chapterTrans.chapter,
            images: chapterTrans.imageContents.map((chapterImage) => ({
              ...chapterImage,
              path: UrlResolverUtils.createUrl(
                'url-resolver',
                this.urlCipherService.generate(
                  plainToInstance(UrlCipherPayload, {
                    url: chapterImage.path,
                    expireIn: 4 * 60 * 60,
                    iat: Date.now(),
                  } as UrlCipherPayload)
                )
              ),
            })),
          } as ImageContentDto);
        } else {
          return plainToInstance(TextContentDto, {
            ...chapterTrans.chapter,
            content: chapterTrans.textContent.content,
          });
        }
      } else {
        throw new BadRequestException();
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getChaptersWithInvoiceRelation(
    userId: number,
    getChapterWithFilterDto: GetChapterWithFilterDto
  ) {
    const qb = this.chapterRepository
      .createQueryBuilder('chapter')
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
}
