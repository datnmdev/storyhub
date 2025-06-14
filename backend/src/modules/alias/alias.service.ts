import { ForbiddenException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Alias } from './entities/alias.entity';
import { Story } from '../story/entities/story.entity';

@Injectable()
export class AliasService {
  constructor(
    @InjectRepository(Alias)
    private readonly aliasRepository: Repository<Alias>,
    private readonly dataSource: DataSource
  ) {}

  getAliasByStoryId(storyId: number) {
    return this.aliasRepository.find({
      where: {
        storyId,
      },
    });
  }

  async updateAlias(authorId: number, storyId: number, aliasData: string[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const story = await queryRunner.manager.findOne(Story, {
        where: {
          authorId,
          id: storyId,
        },
      });
      if (story) {
        // Xoá hết các alias hiện có
        await queryRunner.manager.delete(Alias, {
          storyId,
        });
        // Tạo alias mới
        const aliasEntities = aliasData.map((alias) =>
          queryRunner.manager.create(Alias, {
            name: alias,
            storyId,
          })
        );
        await queryRunner.manager.save(aliasEntities);
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
