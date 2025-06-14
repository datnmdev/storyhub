import { forwardRef, Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { PriceModule } from '../price/price.module';
import { ChapterModule } from '../chapter/chapter.module';
import { WalletModule } from '../wallet/wallet.module';
import { StoryModule } from '../story/story.module';
import { InvoiceService } from './invoice.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice]),
    PriceModule,
    forwardRef(() => ChapterModule),
    WalletModule,
    StoryModule,
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule {}
