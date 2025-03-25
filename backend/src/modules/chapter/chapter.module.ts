import { Module } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { ChapterController } from './chapter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapter } from './entities/chapter.entity';
import { PriceModule } from '../price/price.module';
import { WalletModule } from '../wallet/wallet.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { ChapterTranslation } from '../chapter-translation/entities/chapter-translation.entity';
import { ImageContent } from './entities/image-content.entity';
import { TextContent } from './entities/text-content.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Chapter,
      ChapterTranslation,
      ImageContent,
      TextContent,
    ]),
    PriceModule,
    WalletModule,
    InvoiceModule,
  ],
  controllers: [ChapterController],
  providers: [ChapterService],
  exports: [ChapterService],
})
export class ChapterModule {}
