import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Alias } from './entities/alias.entity';

@Injectable()
export class AliasService {
  constructor(
    @InjectRepository(Alias)
    private aliasRepository: Repository<Alias>
  ) {}

  getAliasByStoryId(storyId: number) {
    return this.aliasRepository.find({
      where: {
        storyId,
      },
    });
  }
}
