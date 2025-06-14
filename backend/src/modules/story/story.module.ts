import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from './entities/story.entity';
import { PriceModule } from '../price/price.module';
import { AliasModule } from '../alias/alias.module';

@Module({
  imports: [TypeOrmModule.forFeature([Story]), PriceModule, AliasModule],
  controllers: [StoryController],
  providers: [StoryService],
  exports: [StoryService],
})
export class StoryModule {}
