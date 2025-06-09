import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ModerationRequest } from './entities/moderation-request';
import { Brackets, DataSource, Repository } from 'typeorm';
import { ModerationRequestStatus } from '@/common/constants/moderation-request.constants';
import { Chapter } from '../chapter/entities/chapter.entity';
import { ChapterStatus } from '@/common/constants/chapter.constants';
import { GetModerationRequestReqDto } from './dtos/get-moderation-request.dto';
import * as lodash from 'lodash';
import UrlResolverUtils from '@/common/utils/url-resolver.util';
import { UrlCipherService } from '@/common/url-cipher/url-cipher.service';
import { plainToInstance } from 'class-transformer';
import { UrlCipherPayload } from '@/common/url-cipher/url-cipher.class';
import { UpdateModerationRequestReqDto } from './dtos/update-moderation-request.dto';
import { ForbiddenException } from '@/common/exceptions/forbidden.exception';

@Injectable()
export class ModerationRequestService {
  constructor(
    @InjectRepository(ModerationRequest)
    private readonly moderationRequestRepository: Repository<ModerationRequest>,
    private readonly dataSource: DataSource,
    private readonly urlCipherService: UrlCipherService
  ) {}

  async createModerationRequest(authorId: number, chapterId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(
        Chapter,
        {
          id: chapterId,
        },
        {
          status: ChapterStatus.PENDING_APPROVAL,
        }
      );
      const moderationRequestEntity = queryRunner.manager.create(
        ModerationRequest,
        {
          status: ModerationRequestStatus.PENDING,
          chapterId,
          authorId,
        }
      );
      await queryRunner.manager.save(moderationRequestEntity);
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getModerationRequestsWithFilter(
    moderatorId: number,
    getModerationRequestReqDto: GetModerationRequestReqDto
  ) {
    const qb = this.moderationRequestRepository
      .createQueryBuilder('moderationRequest')
      .leftJoinAndSelect('moderationRequest.chapter', 'chapter')
      .leftJoinAndSelect('moderationRequest.author', 'author')
      .leftJoinAndSelect('chapter.story', 'story')
      .leftJoinAndSelect('chapter.chapterTranslations', 'chapterTranslations')
      .leftJoinAndSelect('chapterTranslations.textContent', 'textContent')
      .leftJoinAndSelect('chapterTranslations.imageContents', 'imageContents')
      .where('moderationRequest.moderator_id = :moderatorId', {
        moderatorId,
      })
      .andWhere(
        new Brackets((qb) => {
          if (getModerationRequestReqDto.keyword) {
            if (!isNaN(Number(getModerationRequestReqDto.keyword))) {
              qb.orWhere('moderationRequest.id = :id', {
                id: Number(getModerationRequestReqDto.keyword),
              });
              qb.orWhere('moderationRequest.chapter_id = :chapterId', {
                chapterId: Number(getModerationRequestReqDto.keyword),
              });
              qb.orWhere('moderationRequest.author_id = :authorId', {
                authorId: Number(getModerationRequestReqDto.keyword),
              });
            }
          }
        })
      )
      .andWhere(
        new Brackets((qb) => {
          if (getModerationRequestReqDto.id) {
            qb.where('moderationRequest.id = :id', {
              id: getModerationRequestReqDto.id,
            });
          }
        })
      )
      .andWhere(
        new Brackets((qb) => {
          if (getModerationRequestReqDto.chapterId) {
            qb.where('moderationRequest.chapter_id = :chapterId', {
              chapterId: getModerationRequestReqDto.chapterId,
            });
          }
        })
      )
      .andWhere(
        new Brackets((qb) => {
          if (getModerationRequestReqDto.authorId) {
            qb.where('moderationRequest.author_id = :authorId', {
              authorId: getModerationRequestReqDto.authorId,
            });
          }
        })
      )
      .andWhere(
        new Brackets((qb) => {
          if (getModerationRequestReqDto.status) {
            getModerationRequestReqDto.status.forEach((status, index) => {
              qb.orWhere(`moderationRequest.status = :status${index}`, {
                [`status${index}`]: status,
              });
            });
          }
        })
      );
    if (getModerationRequestReqDto.orderBy) {
      getModerationRequestReqDto.orderBy.forEach((value) => {
        qb.addOrderBy(`moderationRequest.${value[0]}`, value[1]);
      });
    }
    qb.take(getModerationRequestReqDto.limit);
    qb.skip(
      (getModerationRequestReqDto.page - 1) * getModerationRequestReqDto.limit
    );

    const result = await qb.getManyAndCount();
    return [
      result[0].map((item) =>
        lodash.update(
          item,
          'chapter.chapterTranslations[0].imageContents',
          (imageContents) =>
            lodash.map(imageContents, (imageContent) => ({
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
            }))
        )
      ),
      result[1],
    ];
  }

  async updateModerationRequest(
    moderatorId: number,
    moderationRequestId: number,
    updateModerationRequestReqDto: UpdateModerationRequestReqDto
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const moderationRequest = await this.moderationRequestRepository.findOne({
        where: {
          id: moderationRequestId,
          moderatorId,
        },
      });
      if (moderationRequest) {
        await queryRunner.manager.update(
          ModerationRequest,
          {
            id: moderationRequestId,
            moderatorId,
          },
          {
            reason: updateModerationRequestReqDto.reason,
            processAt: new Date(),
            status: updateModerationRequestReqDto.status,
          }
        );

        await queryRunner.manager.update(
          Chapter,
          {
            id: moderationRequest.chapterId,
          },
          {
            status:
              updateModerationRequestReqDto.status ===
              ModerationRequestStatus.APPROVED
                ? ChapterStatus.RELEASING
                : ChapterStatus.UNRELEASED,
          }
        );
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
