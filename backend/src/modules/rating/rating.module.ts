import { Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingDetail } from './entities/rating-detail.entity';
import { RatingService } from './rating.service';

@Module({
  imports: [TypeOrmModule.forFeature([RatingDetail])],
  controllers: [RatingController],
  providers: [RatingService],
})
export class RatingModule {}
