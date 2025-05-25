import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ModerationRequest } from './entities/moderation-request';
import { DataSource, Repository } from 'typeorm';
import { ModerationRequestStatus } from '@/common/constants/moderation-request.constants';
import { Chapter } from '../chapter/entities/chapter.entity';
import { ChapterStatus } from '@/common/constants/chapter.constants';

@Injectable()
export class ModerationRequestService {
  constructor(
    @InjectRepository(ModerationRequest)
    private readonly moderationRequestRepository: Repository<ModerationRequest>,
    private readonly dataSource: DataSource
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
}
