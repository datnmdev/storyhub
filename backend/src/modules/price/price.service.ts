import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Price } from './entities/price.entity';
import { DataSource, LessThanOrEqual, Repository } from 'typeorm';
import { Story } from '../story/entities/story.entity';

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,
    private readonly dataSource: DataSource
  ) {}

  async getCurrentPrice(storyId: number) {
    const prices = await this.priceRepository.find({
      where: {
        storyId,
        startTime: LessThanOrEqual(new Date()),
      },
      order: {
        startTime: 'desc',
      },
      take: 1,
    });

    if (prices.length == 0) {
      return 0;
    }
    return Number(prices[0].amount);
  }

  async getPriceAt(storyId: number, atTime: Date) {
    const prices = await this.priceRepository.find({
      where: {
        storyId,
        startTime: LessThanOrEqual(atTime),
      },
      order: {
        startTime: 'desc',
      },
      take: 1,
    });

    if (prices.length == 0) {
      return 0;
    }
    return Number(prices[0].amount);
  }

  async createPrice(authorId: number, storyId: number, amount: string) {
    try {
      const story = await this.dataSource.manager.findOne(Story, {
        where: {
          id: storyId,
          authorId,
        },
      });
      if (story) {
        const now = new Date();
        const priceEntity = this.priceRepository.create({
          storyId,
          startTime: now,
          createdAt: now,
          updatedAt: now,
          amount,
        });
        return this.priceRepository.save(priceEntity);
      }
      throw new ForbiddenException();
    } catch (error) {
      throw error;
    }
  }
}
