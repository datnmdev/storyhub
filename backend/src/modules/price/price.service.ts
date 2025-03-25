import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Price } from './entities/price.entity';
import { LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Price)
    private priceRepository: Repository<Price>
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
}
